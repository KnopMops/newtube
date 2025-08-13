import ResponsiveDialog from '@/components/responsive-dialog'
import { UploadDropzone } from '@/libs/uploadthing'
import { trpc } from '@/trpc/client'

interface ThumbnailUploadModalProps {
	videoId: string
	open: boolean
	onOpenChange: (open: boolean) => void
}

const ThumbnailUploadModal = ({
	videoId,
	open,
	onOpenChange,
}: ThumbnailUploadModalProps) => {
	const utils = trpc.useUtils()

	const onUploadComplete = () => {
		utils.studio.getMany.invalidate()
		utils.studio.getOne.invalidate({ id: videoId })

		onOpenChange(false)
	}

	return (
		<ResponsiveDialog
			title='Загрузить обложку'
			open={open}
			onOpenChange={onOpenChange}
		>
			<UploadDropzone
				endpoint='imageUploader'
				input={{ videoId }}
				onClientUploadComplete={onUploadComplete}
			/>
		</ResponsiveDialog>
	)
}

export default ThumbnailUploadModal
