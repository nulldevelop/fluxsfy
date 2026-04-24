import { redirect } from 'next/navigation'
import { getSession } from '@/lib/getSession'
import { Toaster } from '@/components/ui/sonner'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session || session.user?.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  return (
    <div className='dark min-h-screen bg-background text-foreground'>
      {children}
      <Toaster duration={2500} theme='dark' richColors />
    </div>
  )
}
