import { redirect } from 'next/navigation'
import { ClinicContent } from './_components/clinics-content'
import { getInfoClinic } from './_data-access/get-info-clinic'

export default async function Clinica({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const userId = (await params).id
  const user = await getInfoClinic({ userId })

  if (!user) {
    redirect('/')
  }

  return <ClinicContent clinic={user} />
}
