import { Calendar } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import getSesion from '@/lib/getSession'
import { Appointments } from './_components/appointments/appointments'
import { ButtonCopyLink } from './_components/button-copy-link'
import { Reminders } from './_components/reminder/reminders'

export default async function Dashboard() {
  const session = await getSesion()

  if (!session) {
    redirect('/')
  }

  return (
    <main>
      <div className='flex items-center justify-end space-x-2'>
        <Link href={`/clinica/${session.user?.id}`} target='_blank'>
          <Button className='flex-1 bg-emerald-500 hover:bg-emerald-400 md:flex-[0]'>
            <Calendar className='h-5 w-5' />
            <span>Novo agendamento</span>
          </Button>
        </Link>

        <ButtonCopyLink userId={session.user?.id} />
      </div>

      <section className='mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2'>
        <Appointments userId={session.user?.id} />

        <Reminders userId={session.user?.id} />
      </section>
    </main>
  )
}
