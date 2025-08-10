import { formatDuration } from '@/utils'
import Image from 'next/image'

interface VideoThumbnailProps {
	imageUrl?: string | null
	previewUrl?: string | null
	duration: number
}

const VideoThumbnail = ({
	imageUrl,
	previewUrl,
	duration,
}: VideoThumbnailProps) => {
	return (
		<div className='relative group'>
			<div className='relative w-full overflow-hidden transition-all rounded-xl aspect-video'>
				<Image
					src={imageUrl ?? '/placeholder.svg'}
					alt='thumbnail'
					fill
					className='w-full h-full object-cover 
					group-hover:opacity-0'
				/>

				<Image
					unoptimized={!!previewUrl}
					src={previewUrl ?? '/placeholder.svg'}
					alt='thumbnail'
					fill
					className='w-full h-full opacity-0 object-cover group-hover:opacity-100'
				/>
			</div>

			<div className='absolute bottom-2 right-2 px-1 py-0.5 rounded bg-black/80 text-white text-xs font-medium'>
				{formatDuration(duration)}
			</div>
		</div>
	)
}

export default VideoThumbnail
