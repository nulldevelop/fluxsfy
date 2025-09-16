import { redirect } from 'next/navigation'
import getSession from '@/lib/getSession'
import { OwnerUsers } from './_components/owner-users'

export default async function OwnerPage() {
  const session = await getSession()
  if (!session || session.user?.role !== 'ADMIN') {
    redirect('/dashboard')
  }
  return <OwnerUsers />
}
