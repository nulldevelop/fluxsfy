import { Calendar } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { LabelSubscription } from '@/components/label-subscription'
import { Button } from '@/components/ui/button'
import { getSession } from '@/lib/getSession'
import { checkSubscription } from '@/utils/permissions/checkSubscription'
import { Appointments } from './_components/appointments/appointments'
import { ButtonCopyLink } from './_components/button-copy-link'
import { Reminders } from './_components/reminder/reminders'

export default async function Dashboard() {
  const session = await getSession()

  if (!session) {
    redirect('/')
  }

  const subscription = await checkSubscription(session?.user?.id!)

  return (
    <main>
      <div className='flex items-center justify-between'>
        <h1 className='justify-content-center font-bold text-2xl'>Dashboard</h1>
        {subscription?.subscriptionStatus !== 'EXPIRED' && (
          <div className='flex items-center justify-end space-x-2'>
            <Link href={`/clinica/${session.user?.slug || session.user?.id}`} target='_blank'>
              <Button className='flex-1 bg-emerald-500 hover:bg-emerald-400 md:flex-[0]'>
                <Calendar className='h-5 w-5' />
                <span>Novo agendamento</span>
              </Button>
            </Link>
            <ButtonCopyLink userId={session.user?.id} slug={session.user?.slug} />
          </div>
        )}
      </div>

      {subscription?.subscriptionStatus === 'EXPIRED' && (
        <LabelSubscription expired={true} />
      )}

      {subscription?.subscriptionStatus === 'TRIAL' && (
        <div className='flex items-center justify-center'>
          <p className='bg- p-2'>{subscription.message}</p>
        </div>
      )}

      {subscription?.subscriptionStatus !== 'EXPIRED' && (
        <section className='mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2'>
          <Appointments userId={session.user?.id} />

          <Reminders userId={session.user?.id} />
        </section>
      )}
    </main>
  )
}
