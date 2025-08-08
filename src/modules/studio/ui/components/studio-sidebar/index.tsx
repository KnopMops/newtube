'use client'

import { Separator } from '@/components/ui/separator'
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar'
import { LogOutIcon, VideoIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { StudioSidebarHeader } from './header'

const StudioSidebar = () => {
	const pathname = usePathname()

	return (
		<Sidebar className='pt-16 z-40' collapsible='icon'>
			<SidebarContent className='bg-background'>
				<SidebarMenu>
					<SidebarGroup>
						<StudioSidebarHeader />

						<SidebarMenuItem className='mb-3'>
							<SidebarMenuButton
								isActive={pathname === '/studio'}
								tooltip='Мой контент'
								asChild
							>
								<Link href='/'>
									<VideoIcon className='size-5' />
									<span className='text-sm'>Мой контент</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>

						<Separator />

						<SidebarMenuItem className='mt-3'>
							<SidebarMenuButton tooltip='Покинуть студию' asChild>
								<Link href='/'>
									<LogOutIcon className='size-5' />
									<span className='text-sm'>Покинуть студию</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarGroup>
				</SidebarMenu>
			</SidebarContent>
		</Sidebar>
	)
}

export default StudioSidebar
