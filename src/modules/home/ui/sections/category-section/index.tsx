'use client'

interface CategorySectionProps {
	categoryId?: string
}

import FilterCarousel from '@/components/filter-carousel'
import { trpc } from '@/trpc/client'
import { useRouter } from 'next/navigation'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

const CategorySection = ({ categoryId }: CategorySectionProps) => {
	return (
		<Suspense
			fallback={<FilterCarousel onSelect={() => {}} data={[]} isLoading />}
		>
			<ErrorBoundary fallback={<p>Ошибка...</p>}>
				<CategorySectionSuspense categoryId={categoryId} />
			</ErrorBoundary>
		</Suspense>
	)
}

const CategorySectionSuspense = ({ categoryId }: CategorySectionProps) => {
	const [categories] = trpc.categories.getMany.useSuspenseQuery()

	const router = useRouter()

	const data = categories.map(category => ({
		value: category.id,
		label: category.name,
	}))

	const onSelect = (value: string | null) => {
		const url = new URL(window.location.href)

		if (value) {
			url.searchParams.set('categoryId', value)
		} else {
			url.searchParams.delete('categoryId')
		}

		router.push(url.toString())
	}

	return <FilterCarousel onSelect={onSelect} value={categoryId} data={data} />
}

export default CategorySection
