import { canPermission } from '@/utils/permissions/canPermission'
import { getAllServices } from '../../services/_data-access/get-all-services'
import { getStaff } from '../_data-access/get-staff'
import { StaffList } from './staff-list'

export async function StaffContent({ userId }: { userId: string }) {
  const [staffData, servicesData, permissions] = await Promise.all([
    getStaff({ userId }),
    getAllServices({ userId }),
    canPermission({ type: 'service' }),
  ])

  return (
    <StaffList
      permissions={permissions}
      services={servicesData.data || []}
      staff={staffData.data || []}
    />
  )
}
