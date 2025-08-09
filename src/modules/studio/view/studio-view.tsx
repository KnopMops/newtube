import VideosSection from '../ui/sections/videos-section'

const StudioView = () => {
	return (
		<div className='flex flex-col gap-y-6 pt-2.5'>
			<div className='px-4'>
				<h1 className='text-2xl font-bold'>Ваш контент</h1>
				<p className='text-xs text-muted-foreground'>
					Редактируйте ваш контент.
				</p>
			</div>

			<VideosSection />
		</div>
	)
}

export default StudioView
