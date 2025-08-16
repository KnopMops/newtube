'use client'

import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { THUMBNAIL_FALLBACK } from '@/constants'
import { videoUpdateSchema } from '@/db/schema'
import { trpc } from '@/trpc/client'
import { snakeCaseToTitle } from '@/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import {
	CopyCheckIcon,
	CopyIcon,
	Globe2Icon,
	ImagePlusIcon,
	LockIcon,
	MoreVerticalIcon,
	RotateCcwIcon,
	SparklesIcon,
	TrashIcon,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Suspense, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import ThumbnailUploadModal from '../components/thumbnail-upload-modal'
import VideoPlayer from '../components/video-player'

interface FormSectionProps {
	videoId: string
}

const FormSection = ({ videoId }: FormSectionProps) => {
	return (
		<Suspense fallback={<FormSectionSkeleton />}>
			<ErrorBoundary fallback={<p>Ошибка...</p>}>
				<FormSectionSuspense videoId={videoId} />
			</ErrorBoundary>
		</Suspense>
	)
}

const FormSectionSkeleton = () => {
	return <p>Загрузка...</p>
}

const FormSectionSuspense = ({ videoId }: FormSectionProps) => {
	const utils = trpc.useUtils()
	const router = useRouter()

	const [video] = trpc.studio.getOne.useSuspenseQuery({ id: videoId })

	const [categories] = trpc.categories.getMany.useSuspenseQuery()

	const update = trpc.videos.update.useMutation({
		onSuccess: () => {
			utils.studio.getMany.invalidate()
			utils.studio.getOne.invalidate({ id: videoId })

			toast.success('Видео обновлено.')
		},
		onError: () => {
			toast.error('Ошибка.')
		},
	})

	const remove = trpc.videos.remove.useMutation({
		onSuccess: () => {
			utils.studio.getMany.invalidate()

			toast.success('Видео удалено.')
			router.push('/studio')
		},
		onError: () => {
			toast.error('Ошибка.')
		},
	})

	const restoreThumbnail = trpc.studio.restoreThumbnail.useMutation({
		onSuccess: () => {
			utils.studio.getMany.invalidate()
			utils.studio.getOne.invalidate({ id: videoId })

			toast.success('Обложка установлена по умолчанию.')
		},
		onError: () => {
			toast.error('Ошибка.')
		},
	})

	const form = useForm<z.infer<typeof videoUpdateSchema>>({
		resolver: zodResolver(videoUpdateSchema),
		defaultValues: video,
	})

	const onSubmit = (data: z.infer<typeof videoUpdateSchema>) => {
		update.mutate(data)
	}

	const [isCopied, setIsCopied] = useState<boolean>(false)

	const [thumbnailModalOpen, setThumbnailModalOpen] = useState<boolean>(false)

	const fullUrl = `${
		process.env.VERCEL_URL || 'http://localhost:3000'
	}/videos/${videoId}`

	const onCopy = async () => {
		await navigator.clipboard.writeText(fullUrl)
		setIsCopied(true)

		setTimeout(() => {
			setIsCopied(false)
		}, 2000)
	}

	return (
		<>
			<ThumbnailUploadModal
				open={thumbnailModalOpen}
				onOpenChange={setThumbnailModalOpen}
				videoId={videoId}
			/>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className='flex items-center justify-between mb-6'>
						<div>
							<h1 className='text-2xl font-bold'>О видео</h1>
							<p className='text-xs text-muted-foreground'>
								Редактируй свое видео
							</p>
						</div>

						<div className='flex items-center gap-x-2'>
							<Button type='submit' disabled={update.isPending}>
								Сохранить
							</Button>

							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant='ghost' size='icon'>
										<MoreVerticalIcon />
									</Button>
								</DropdownMenuTrigger>

								<DropdownMenuContent align='end'>
									<DropdownMenuItem
										onClick={() => remove.mutate({ id: videoId })}
									>
										<TrashIcon className='size-4 mr-2' />
										Удалить
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>

					<div className='grid grid-cols-1 lg:grid-cols-5 gap-6'>
						<div className='space-y-8 lg:col-span-3'>
							<FormField
								control={form.control}
								name='title'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Название</FormLabel>

										<FormControl>
											<Input {...field} placeholder='Изменить название видео' />
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='description'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Описание</FormLabel>

										<FormControl>
											<Textarea
												{...field}
												value={field.value ?? ''}
												rows={10}
												className='resize-none pr-10'
												placeholder='Изменить описание видео'
											/>
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								name='thumbnailUrl'
								control={form.control}
								render={() => (
									<FormItem>
										<FormLabel>Обложка</FormLabel>
										<FormControl>
											<div className='p-0.5 border border-dashed border-neutral-400 relative h-[84px] w-[153px] group'>
												<Image
													src={video.thumbnailUrl ?? THUMBNAIL_FALLBACK}
													className='object-cover'
													fill
													alt='thumbnail'
												/>

												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button
															type='button'
															size='icon'
															className='bg-black/50 hover:bg-black/50 absolute top-1 right-1 rounded-full opacity-100 md:opacity-0 group-hover:opacity-100 duration-300 size-7 cursor-pointer'
														>
															<MoreVerticalIcon className='text-white' />
														</Button>
													</DropdownMenuTrigger>

													<DropdownMenuContent align='start' side='right'>
														<DropdownMenuItem
															className='cursor-pointer'
															onClick={() => setThumbnailModalOpen(true)}
														>
															<ImagePlusIcon className='size-4 mr-1' />
															Изменить
														</DropdownMenuItem>

														<DropdownMenuItem
															className='cursor-pointer'
															disabled
														>
															<SparklesIcon className='size-4 mr-1' />
															Сгенерировать ИИ
														</DropdownMenuItem>

														<DropdownMenuItem
															className='cursor-pointer'
															onClick={() =>
																restoreThumbnail.mutate({ id: videoId })
															}
														>
															<RotateCcwIcon className='size-4 mr-1' />
															Вернуть
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</div>
										</FormControl>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='categoryId'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Категория</FormLabel>

										<Select
											onValueChange={field.onChange}
											defaultValue={field.value ?? undefined}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder='Выбрать категорию' />
												</SelectTrigger>
											</FormControl>

											<SelectContent>
												{categories.map(category => (
													<SelectItem key={category.id} value={category.id}>
														{category.name}
													</SelectItem>
												))}
											</SelectContent>

											<FormMessage />
										</Select>
									</FormItem>
								)}
							/>
						</div>

						<div className='flex flex-col gap-y-8 lg:col-span-2'>
							<div className='flex flex-col gap-4 bg-[#F9F9F9] rounded-xl overflow-hidden h-fit'>
								<div className='aspect-video overflow-hidden relative'>
									<VideoPlayer
										playbackId={video.muxPlaybackId}
										thumbnailUrl={video.thumbnailUrl}
									/>
								</div>

								<div className='p-4 flex flex-col gap-y-6'>
									<div className='flex justify-between items-center gap-x-2'>
										<div className='flex flex-col gap-y-1'>
											<p className='text-muted-foreground text-xs'>
												Ссылка на видео
											</p>

											<div className='flex items-center gap-x-2'>
												<Link href={`/videos/${video.id}`}>
													<p className='line-clamp-1 text-sm text-blue-500'>
														{fullUrl}
													</p>
												</Link>

												<Button
													type='button'
													variant='ghost'
													size='icon'
													className='shrink-0'
													onClick={onCopy}
													disabled={isCopied}
												>
													{isCopied ? <CopyCheckIcon /> : <CopyIcon />}
												</Button>
											</div>
										</div>
									</div>

									<div className='flex justify-between items-center'>
										<div className='flex flex-col gap-y-1'>
											<p className='text-muted-foregroun text-xs'>
												Статус загрузки
											</p>

											<p>
												{snakeCaseToTitle(
													video.muxStatus === 'pending'
														? 'Загрузка'
														: video.muxStatus === 'preparing'
														? 'Обработка'
														: video.muxStatus === 'waiting'
														? 'Ожидание'
														: 'Готово'
												)}
											</p>
										</div>
									</div>

									<div className='flex justify-between items-center'>
										<div className='flex flex-col gap-y-1'>
											<p className='text-muted-foregroun text-xs'>
												Статус субтитров
											</p>

											<p>
												{snakeCaseToTitle(
													video.muxTrackStatus === 'no_audio' ? 'Нет' : 'Готовы'
												)}
											</p>
										</div>
									</div>
								</div>
							</div>

							<FormField
								control={form.control}
								name='categoryId'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Категория</FormLabel>

										<Select
											onValueChange={field.onChange}
											defaultValue={field.value ?? undefined}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder='Выбрать категорию' />
												</SelectTrigger>
											</FormControl>

											<SelectContent>
												{categories.map(category => (
													<SelectItem key={category.id} value={category.id}>
														{category.name}
													</SelectItem>
												))}
											</SelectContent>

											<FormMessage />
										</Select>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='visibility'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Видимость для других</FormLabel>

										<Select
											onValueChange={field.onChange}
											defaultValue={field.value ?? undefined}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder='Выбрать видимость' />
												</SelectTrigger>
											</FormControl>

											<SelectContent>
												<SelectItem value='public'>
													<div className='flex items-center'>
														<Globe2Icon className='size-4 mr-2' />
														Публичное
													</div>
												</SelectItem>

												<SelectItem value='private'>
													<div className='flex items-center'>
														<LockIcon className='size-4 mr-2' />
														Приватное
													</div>
												</SelectItem>
											</SelectContent>
										</Select>

										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</div>
				</form>
			</Form>
		</>
	)
}

export default FormSection
