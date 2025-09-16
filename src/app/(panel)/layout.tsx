import { redirect } from 'next/navigation'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'
import getSession from '@/lib/getSession'
import { AppSidebar } from './dashboard/_components/sidebar'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect('/')
  }
  const isAdmin = session?.user?.role === 'ADMIN'
  return (
    <SidebarProvider>
      <AppSidebar isAdmin={isAdmin} />
      <SidebarInset>
        <SidebarTrigger />
        <main className='p-1'>
          {children}
          <Toaster duration={2500} expand={true} richColors />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
