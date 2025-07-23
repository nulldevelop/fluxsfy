import {
 CalendarCheck2,
 DollarSign,
 Folder, Settings
} from 'lucide-react';
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
} from '@/components/ui/sidebar';

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
};

export function AppSidebar() {
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
            <SidebarMenuButton asChild size="lg">
              <div className="flex items-center gap-2 p-2">
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{'Admin'}</span>
                  <span className="truncate text-muted-foreground text-xs">
                    {'Admin'}
                  </span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
