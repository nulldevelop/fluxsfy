import { redirect } from 'next/navigation'
import getSesion from '@/lib/getSession'
import { getSubs } from '@/utils/get-subs'
import { GridPlans } from './_components/grid-plans'

export default async function Plans() {
  const session = await getSesion()

  if (!session) {
    redirect('/')
  }

  const userId = session?.user?.id
  const subscription = userId ? await getSubs(userId) : null

  return (
    <div>
      {subscription?.status !== 'active' && <GridPlans />} 
      {subscription?.status === 'active' && <h1>Você já possui uma assinatura ativa</h1>}
    </div>
  )
}
