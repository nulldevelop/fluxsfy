import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { getSession } from '@/lib/getSession'
import { StaffContent } from './_components/staff-content'

export default async function StaffPage() {
  const session = await getSession()
  if (!session) {
    redirect('/')
  }

  return (
    <Suspense fallback={<div>Carregando funcionários...</div>}>
      <StaffContent userId={session.user?.id} />
    </Suspense>
  )
}
