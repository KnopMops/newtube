import { HydrateClient, trpc } from '@/trpc/server'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { PageClient } from './client'

export default function Home() {
	void trpc.hello.prefetch({ text: 'Andrey' })

	return (
		<HydrateClient>
			<Suspense fallback={<p>Загрузка...</p>}>
				<ErrorBoundary fallback={<p>Ошибка...</p>}>
					<PageClient />
				</ErrorBoundary>
			</Suspense>
		</HydrateClient>
	)
}
