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
    <main className="p-4 space-y-6">
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <h1 className='font-bebas text-5xl text-primary tracking-widest'>PAINEL DE CONTROLE</h1>
        {subscription?.subscriptionStatus !== 'EXPIRED' && (
          <div className='flex items-center space-x-2'>
            <Link href={`/clinica/${session.user?.id}`} target='_blank'>
              <Button variant="default" className='flex-1 md:flex-[0]'>
                <Calendar className='h-5 w-5' />
                <span>Minha Barbearia</span>
              </Button>
            </Link>
            <ButtonCopyLink userId={session.user?.id} />
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
