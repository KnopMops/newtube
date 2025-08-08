'use client'

import { trpc } from '@/trpc/client'

export const PageClient = () => {
	const [data] = trpc.hello.useSuspenseQuery({
		text: 'Andrey',
	})

	return <div>{data.greeting}</div>
}
