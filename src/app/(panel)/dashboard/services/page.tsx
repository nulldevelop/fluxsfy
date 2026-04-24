import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { getSession } from '@/lib/getSession'
import ServiceContent from './_components/service-content'

export default async function Service() {
  const session = await getSession()
  if (!session) {
    redirect('/')
  }

  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ServiceContent userId={session.user?.id} />
    </Suspense>
  )
}
