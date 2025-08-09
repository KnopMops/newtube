'use client'

import InfiniteScroll from '@/components/infinite-scroll'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { DEFAULT_LIMIT } from '@/constants'
import { trpc } from '@/trpc/client'
import Link from 'next/link'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

const VideosSection = () => {
	return (
		<Suspense fallback={<p>Загрузка...</p>}>
			<ErrorBoundary fallback={<p>Ошибка...</p>}>
				<VideosSectionSuspense />
			</ErrorBoundary>
		</Suspense>
	)
}

const VideosSectionSuspense = () => {
	const [videos, query] = trpc.studio.getMany.useSuspenseInfiniteQuery(
		{
			limit: DEFAULT_LIMIT,
		},
		{
			getNextPageParam: lastPage => lastPage.nextCursor,
		}
	)

	return (
		<div>
			<div className='border-y'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className='pl-6 w-[510px]'>Видео</TableHead>

							<TableHead>Видимость</TableHead>
							<TableHead>Статус</TableHead>
							<TableHead>Дата</TableHead>

							<TableHead className='text-right'>Кол-во просмотров</TableHead>
							<TableHead className='text-right'>Кол-во комментариев</TableHead>
							<TableHead className='text-right pr-6'>Кол-во лайков</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{videos.pages
							.flatMap(page => page.items)
							.map(video => (
								<Link href={`/studio/videos/${video.id}`} key={video.id}>
									<TableRow className='cursor-pointer'>
										<TableCell>{video.title}</TableCell>

										<TableCell>видимость</TableCell>

										<TableCell>статус</TableCell>

										<TableCell>{video.title}</TableCell>
									</TableRow>
								</Link>
							))}
					</TableBody>
				</Table>
			</div>

			<InfiniteScroll
				hasNextPage={query.hasNextPage}
				isFetchingNextPage={query.isFetchingNextPage}
				fetchNextPage={query.fetchNextPage}
				isManual
			/>
		</div>
	)
}

export default VideosSection
