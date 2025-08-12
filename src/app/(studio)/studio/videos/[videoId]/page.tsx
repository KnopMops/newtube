import VideoView from '@/modules/studio/view/video-view'
import { HydrateClient, trpc } from '@/trpc/server'

export const dynamic = 'force-dynamic'

interface StudioVideoPageProps {
	params: Promise<{ videoId: string }>
}

const StudioVideoPage = async ({ params }: StudioVideoPageProps) => {
	const { videoId } = await params

	void trpc.studio.getOne.prefetch({ id: videoId })
	void trpc.categories.getMany.prefetch()

	return (
		<HydrateClient>
			<VideoView videoId={videoId} />
		</HydrateClient>
	)
}

export default StudioVideoPage
