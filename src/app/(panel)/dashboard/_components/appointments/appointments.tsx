import { getTimesClinic } from '../../_data-access/get-times-clinic'
import { getStaff } from '../../staff/_data-access/get-staff'
import { AppointmentsList } from './appointments-list'

export async function Appointments({ userId }: { userId: string }) {
  const [times, staffData] = await Promise.all([
    getTimesClinic({ userId }),
    getStaff({ userId }),
  ])

  return <AppointmentsList staff={staffData.data || []} times={times.times} />
}
