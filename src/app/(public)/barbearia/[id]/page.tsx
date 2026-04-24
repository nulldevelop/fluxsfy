import { redirect } from 'next/navigation'
import { ScheduleContent } from './_components/schedule-content'
import { getInfoSchedule } from './_data-access/get-info-schedule'

export const dynamic = 'force-dynamic'

function convertTimes(times: unknown): string[] {
  if (Array.isArray(times)) {
    return times as string[]
  }
  return []
}

export default async function SchedulePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const userId = (await params).id
  const user = await getInfoSchedule({ userId })

  if (!user) {
    redirect('/')
  }

  const clinic = {
    ...user,
    times: convertTimes(user.times),
    staff: user.staff.map((s) => ({
      ...s,
      times: convertTimes(s.times),
    })),
  }

  return <ScheduleContent clinic={clinic} />
}
