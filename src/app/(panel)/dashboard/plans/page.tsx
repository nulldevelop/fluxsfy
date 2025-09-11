import { redirect } from 'next/navigation'
import getSesion from '@/lib/getSession'
import { getSubs } from '@/utils/get-subs'
import { GridPlans } from './_components/grid-plans'
import { SubscriptionDetail } from './_components/subscription-detail'

export default async function Plans() {
  const session = await getSesion()

  if (!session) {
    redirect('/')
  }
  const subscription = await getSubs(session.user?.id!)
  return (
    <div>
      {subscription?.status !== 'active' && <GridPlans />}
      {subscription?.status === 'active' && (
        <SubscriptionDetail subscription={subscription!} />
      )}
    </div>
  )
}
