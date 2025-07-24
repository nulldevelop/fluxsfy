import { redirect } from 'next/navigation'
import { ScheduleContent } from './_components/schedule-content'
import { getInfoClinic } from './_data-access/get-info-schedule'

export default async function SchedulePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const userId = (await params).id
  const user = await getInfoClinic({ userId })

  if (!user) {
    redirect('/')
  }

  return <ScheduleContent clinic={user} />
}
