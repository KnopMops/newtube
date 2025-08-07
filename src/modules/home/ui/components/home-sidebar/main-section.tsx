'use client'

import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar'
import { FlameIcon, HomeIcon, LucideIcon, PlaySquareIcon } from 'lucide-react'
import Link from 'next/link'

interface IItem {
	title: string
	url: string
	icon: LucideIcon
	auth?: boolean
}

const items: IItem[] = [
	{
		title: 'Главная',
		url: '/',
		icon: HomeIcon,
	},
	{
		title: 'Подписки',
		url: '/feed/subscriptions',
		icon: PlaySquareIcon,
		auth: true,
	},
	{
		title: 'Тренды',
		url: '/feed/trending',
		icon: FlameIcon,
	},
]

const MainSection = () => {
	return (
		<SidebarGroup>
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

export default MainSection
