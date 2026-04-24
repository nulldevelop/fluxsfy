'use client'
import {
  CalendarCheck2,
  DollarSign,
  Folder,
  LogOut,
  Settings,
  Users,
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
type NavItem = {
  title: string
  url: string
  icon: React.ElementType
  bagde?: number
  adminOnly?: boolean
}

const data: { navMain: NavItem[]; navSecondary: NavItem[] } = {
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
    {
      title: 'Funcionários',
      url: '/dashboard/staff',
      icon: Users,
    },
    {
      title: 'Admin',
      url: '/dashboard-owner',
      icon: Settings,
      adminOnly: true,
    },
  ],
  navSecondary: [
    {
      title: 'Barbearia',
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

export function AppSidebar({ isAdmin = false }: { isAdmin?: boolean }) {
  const handleLogout = async () => {
    await handleLogoutAction()
  }

  return (
    <Sidebar className='border-primary border-r'>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className='font-bebas text-gold text-lg tracking-widest'>
            Painel
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain
                .filter((item) => (item.adminOnly ? isAdmin : true))
                .map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className='font-barlow font-bold uppercase tracking-widest transition-colors hover:text-gold'
                    >
                      <a href={item.url}>
                        <item.icon className='text-gold' />
                        <span>{item.title}</span>
                        <SidebarMenuBadge className='bg-gold text-black'>
                          {item.bagde}
                        </SidebarMenuBadge>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className='font-bebas text-gold text-lg tracking-widest'>
            Configurações
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navSecondary.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className='font-barlow font-bold uppercase tracking-widest transition-colors hover:text-gold'
                  >
                    <a href={item.url}>
                      <item.icon className='text-gold' />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className='border-primary/20 border-t'>
        <SidebarMenu>
          <SidebarMenuItem>
            <Button
              className='w-full justify-start gap-2'
              onClick={handleLogout}
              variant='destructive'
            >
              <LogOut size={16} />
              <span>Sair</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
