import { db } from '@/db'
import { users, videos, videoUpdateSchema } from '@/db/schema'
import { mux } from '@/libs/mux'
import {
	baseProcedure,
	createTRPCRouter,
	protectedProcedure,
} from '@/trpc/init'
import { TRPCError } from '@trpc/server'
import { and, eq, getTableColumns } from 'drizzle-orm'
import { z } from 'zod'

export const videosRouter = createTRPCRouter({
	getOne: baseProcedure
		.input(z.object({ id: z.string().uuid() }))
		.query(async ({ input }) => {
			const [existingVideo] = await db
				.select({
					...getTableColumns(videos),
					user: {
						...getTableColumns(users),
					},
				})
				.from(videos)
				.innerJoin(users, eq(videos.userId, users.id))
				.where(eq(videos.id, input.id))

			if (!existingVideo) throw new TRPCError({ code: 'NOT_FOUND' })

			return existingVideo
		}),
	remove: protectedProcedure
		.input(z.object({ id: z.string().uuid() }))
		.mutation(async ({ ctx, input }) => {
			const { id: userId } = ctx.user

			const [removedVideo] = await db
				.delete(videos)
				.where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
				.returning()

			if (!removedVideo) throw new TRPCError({ code: 'NOT_FOUND' })

			return removedVideo
		}),
	update: protectedProcedure
		.input(videoUpdateSchema)
		.mutation(async ({ ctx, input }) => {
			const { id: userId } = ctx.user

			if (!input.id) throw new TRPCError({ code: 'BAD_REQUEST' })

			const [updatedVideo] = await db
				.update(videos)
				.set({
					title: input.title,
					description: input.description,
					categoryId: input.categoryId,
					visibility: input.visibility,
					updatedAt: new Date(),
				})
				.where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
				.returning()

			if (!updatedVideo) throw new TRPCError({ code: 'NOT_FOUND' })
		}),
	create: protectedProcedure.mutation(async ({ ctx }) => {
		const { id: userId } = ctx.user

		const upload = await mux.video.uploads.create({
			new_asset_settings: {
				passthrough: userId,
				playback_policies: ['public'],
				input: [
					{
						generated_subtitles: [
							{
								language_code: 'en',
								name: 'Английский',
							},
						],
					},
				],
			},
			cors_origin: '*',
		})

		const [video] = await db
			.insert(videos)
			.values({
				userId,
				title: 'Без названия',
				muxStatus: 'waiting',
				muxUploadId: upload.id,
			})
			.returning()

		return {
			video: video,
			url: upload.url,
		}
	}),
})
