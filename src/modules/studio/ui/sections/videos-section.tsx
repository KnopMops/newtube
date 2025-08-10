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
import VideoThumbnail from '@/modules/videos/ui/components/video-thumbnail'
import { trpc } from '@/trpc/client'
import { snakeCaseToTitle } from '@/utils'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Globe2Icon, LockIcon } from 'lucide-react'
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
							<TableHead>Дата создания</TableHead>

							<TableHead className='text-right'>Кол-во просмотров</TableHead>
							<TableHead className='text-right'>Кол-во комментариев</TableHead>
							<TableHead className='text-right pr-6'>Кол-во лайков</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{videos.pages
							.flatMap(page => page.items)
							.map(video => (
								<TableRow
									key={video.id}
									className='cursor-pointer hover:bg-muted/50'
								>
									<TableCell>
										<Link href={`/studio/videos/${video.id}`} className='block'>
											<div className='flex items-center gap-4'>
												<div className='relative aspect-video w-36 shrink-0'>
													<VideoThumbnail
														imageUrl={video.thumbnailUrl}
														previewUrl={video.previewUrl}
														duration={video.duration || 0}
													/>
												</div>

												<div className='flex flex-col overflow-hidden gap-y-1'>
													<span className='text-sm line-clamp-1'>
														{video.title}
													</span>
													<span className='text-xs text-muted-foreground line-clamp-1'>
														{video.description || 'Нет описания'}
													</span>
												</div>
											</div>
										</Link>
									</TableCell>

									<TableCell>
										<div className='flex items-center'>
											{video.visibility === 'private' ? (
												<LockIcon className='size-4 mr-2' />
											) : (
												<Globe2Icon className='size-4 mr-2' />
											)}

											{video.visibility === 'private'
												? 'Приватное'
												: 'Публичное'}
										</div>
									</TableCell>

									<TableCell className='text-sm truncate'>
										<div className='flex items-center'>
											{snakeCaseToTitle(
												video.muxStatus === 'waiting' ? 'Ожидание' : 'Готов'
											)}
										</div>
									</TableCell>

									<TableCell>
										{format(new Date(video.createdAt), 'd MMM yyyy', {
											locale: ru,
										})}
									</TableCell>

									<TableCell>
										{format(new Date(video.createdAt), 'd MMM yyyy', {
											locale: ru,
										})}
									</TableCell>

									<TableCell>
										{format(new Date(video.createdAt), 'd MMM yyyy', {
											locale: ru,
										})}
									</TableCell>

									<TableCell>
										{format(new Date(video.createdAt), 'd MMM yyyy', {
											locale: ru,
										})}
									</TableCell>
								</TableRow>
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
