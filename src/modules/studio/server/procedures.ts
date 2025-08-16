import { db } from '@/db'
import { videos } from '@/db/schema'
import { createTRPCRouter, protectedProcedure } from '@/trpc/init'
import { TRPCError } from '@trpc/server'
import { and, desc, eq, lt, or } from 'drizzle-orm'
import { UTApi } from 'uploadthing/server'

import { z } from 'zod'

export const studioRouter = createTRPCRouter({
	//generateThumbnail: protectedProcedure
	//	.input(z.object({ id: z.string().uuid() }))
	//	.mutation(async ({ ctx, input }) => {
	//		const { id: userId } = ctx.user
	//
	//		const { workflowRunId } = await workflow.trigger({
	//			url: `${process.env.UPSTASH_WORKFLOW_URL!}/api/videos/workflows/title`,
	//			body: { userId, videoId: input.id },
	//		})
	//
	//		return workflowRunId
	//	}),
	restoreThumbnail: protectedProcedure
		.input(z.object({ id: z.string().uuid() }))
		.mutation(async ({ ctx, input }) => {
			const { id: userId } = ctx.user

			const [existingVideo] = await db
				.select()
				.from(videos)
				.where(and(eq(videos.id, input.id), eq(videos.userId, userId)))

			if (!existingVideo) throw new TRPCError({ code: 'NOT_FOUND' })

			if (existingVideo.thumbnailKey) {
				const utapi = new UTApi()

				await utapi.deleteFiles(existingVideo.thumbnailKey)
				await db
					.update(videos)
					.set({ thumbnailKey: null, thumbnailUrl: null })
					.where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
			}

			if (!existingVideo.muxPlaybackId)
				throw new TRPCError({ code: 'BAD_REQUEST' })

			const tmpThumbnailUrl = `https://image.mux.com/${existingVideo.muxPlaybackId}/thumbnail.jpg`

			const utapi = new UTApi()
			const uploadedThumbnail = await utapi.uploadFilesFromUrl(tmpThumbnailUrl)

			if (!uploadedThumbnail.data)
				throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })

			const { key: thumbnailKey, url: thumbnailUrl } = uploadedThumbnail.data

			const [updatedVideo] = await db
				.update(videos)
				.set({ thumbnailUrl, thumbnailKey })
				.where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
				.returning()

			return updatedVideo
		}),
	getOne: protectedProcedure
		.input(z.object({ id: z.string().uuid() }))
		.query(async ({ ctx, input }) => {
			const { id: userId } = ctx.user
			const { id } = input

			const [video] = await db
				.select()
				.from(videos)
				.where(and(eq(videos.id, id), eq(videos.userId, userId)))

			if (!video) throw new TRPCError({ code: 'NOT_FOUND' })

			return video
		}),
	getMany: protectedProcedure
		.input(
			z.object({
				cursor: z
					.object({ id: z.string().uuid(), updatedAt: z.date() })
					.nullish(),
				limit: z.number().min(1).max(100),
			})
		)
		.query(async ({ ctx, input }) => {
			const { cursor, limit } = input
			const {
				user: { id: userId },
			} = ctx

			const data = await db
				.select()
				.from(videos)
				.where(
					and(
						eq(videos.userId, userId),
						cursor
							? or(
									lt(videos.updatedAt, cursor.updatedAt),
									and(
										eq(videos.updatedAt, cursor.updatedAt),
										lt(videos.id, cursor.id)
									)
							  )
							: undefined
					)
				)
				.orderBy(desc(videos.updatedAt), desc(videos.id))
				.limit(limit + 1)

			const hasMore = data.length > limit
			const items = hasMore ? data.slice(0, -1) : data
			const lastItem = items[items.length - 1]

			const nextCursor = hasMore
				? {
						id: lastItem.id,
						updatedAt: lastItem.updatedAt,
				  }
				: null

			return {
				items,
				nextCursor,
			}
		}),
})
