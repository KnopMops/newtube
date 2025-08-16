import VideoView from '@/modules/videos/view/video-view'
import { HydrateClient, trpc } from '@/trpc/server'

interface VideoPageProps {
	params: Promise<{ videoId: string }>
}

const VideoPage = async ({ params }: VideoPageProps) => {
	const { videoId } = await params

	void trpc.videos.getOne.prefetch({ id: videoId })

	return (
		<HydrateClient>
			<VideoView videoId={videoId} />
		</HydrateClient>
	)
}

export default VideoPage
