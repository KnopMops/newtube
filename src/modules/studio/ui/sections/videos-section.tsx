'use client'

import { DEFAULT_LIMIT } from '@/constants'
import { trpc } from '@/trpc/client'
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
	const [data] = trpc.studio.getMany.useSuspenseInfiniteQuery(
		{
			limit: DEFAULT_LIMIT,
		},
		{
			getNextPageParam: lastPage => lastPage.nextCursor,
		}
	)

	return <div>{JSON.stringify(data)}</div>
}

export default VideosSection
