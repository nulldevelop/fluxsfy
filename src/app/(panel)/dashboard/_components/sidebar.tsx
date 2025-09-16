'use client'
import {
  CalendarCheck2,
  DollarSign,
  Folder,
  LogOut,
  Settings,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { handleLogoutAction } from '../_actions/logout'

// Menu items.
const data = {
  navMain: [
    {
      title: 'Agendamento',
      url: '/dashboard',
      icon: CalendarCheck2,
      bagde: 24,
    },
    {
      title: 'Serviços',
      url: '/dashboard/services',
      icon: Folder,
    },
  ],
  navSecondary: [
    {
      title: 'Meu perfil',
      url: '/dashboard/profile',
      icon: Settings,
    },
    {
      title: 'Planos',
      url: '/dashboard/plans',
      icon: DollarSign,
    },
  ],
}

export function AppSidebar() {
  const handleLogout = async () => {
    await handleLogoutAction()
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Painel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                      <SidebarMenuBadge>{item.bagde}</SidebarMenuBadge>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Configurações</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navSecondary.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild onClick={handleLogout} size='lg'>
              <Button className='flex w-full items-center gap-2 rounded p-2 text-left hover:bg-gray-200'>
                <LogOut size={16} />
                <span>Sair</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
