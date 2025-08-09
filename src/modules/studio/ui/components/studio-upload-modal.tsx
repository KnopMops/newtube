'use client'

import ResponsiveDialog from '@/components/responsive-dialog'
import { Button } from '@/components/ui/button'
import { trpc } from '@/trpc/client'
import { Loader2Icon, PlusIcon } from 'lucide-react'
import { toast } from 'sonner'
import StudioUploader from './studio-uploader'

const StudioUploadModal = () => {
	const utils = trpc.useUtils()

	const create = trpc.videos.create.useMutation({
		onSuccess: () => {
			toast.success('Вы создали видео.')
			utils.studio.getMany.invalidate()
		},
		onError: error => toast.error(error.message),
	})

	return (
		<>
			<ResponsiveDialog
				open={!!create.data?.url}
				title='Загрузить видео'
				onOpenChange={() => create.reset()}
			>
				{create.data?.url ? (
					<StudioUploader endpoint={create.data.url} onSuccess={() => {}} />
				) : (
					<Loader2Icon />
				)}
			</ResponsiveDialog>

			<Button
				variant='secondary'
				onClick={() => create.mutate()}
				disabled={create.isPending}
				className='cursor-pointer'
			>
				{create.isPending ? (
					<Loader2Icon className='animate-spin' />
				) : (
					<PlusIcon />
				)}
				Создать
			</Button>
		</>
	)
}

export default StudioUploadModal
