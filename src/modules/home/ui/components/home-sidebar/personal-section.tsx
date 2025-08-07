'use client'

import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar'
import {
	HistoryIcon,
	ListVideoIcon,
	LucideIcon,
	ThumbsUpIcon,
} from 'lucide-react'
import Link from 'next/link'

interface IItem {
	title: string
	url: string
	icon: LucideIcon
	auth?: boolean
}

const items: IItem[] = [
	{
		title: 'История просмотров',
		url: '/playlists/history',
		icon: HistoryIcon,
		auth: true,
	},
	{
		title: 'Понравившиеся видео',
		url: '/playlists/liked',
		icon: ThumbsUpIcon,
		auth: true,
	},
	{
		title: 'Все плейлисты',
		url: '/playlists',
		icon: ListVideoIcon,
		auth: true,
	},
]

const PersonalSection = () => {
	return (
		<SidebarGroup>
			<SidebarGroupLabel>Для вас</SidebarGroupLabel>
			<SidebarGroupContent>
				<SidebarMenu>
					{items.map(item => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton
								tooltip={item.title}
								asChild
								isActive={false}
								onClick={() => {}}
							>
								<Link href={item.url} className='flex items-center gap-4'>
									<item.icon />
									<span className='text-sm'>{item.title}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	)
}

export default PersonalSection
