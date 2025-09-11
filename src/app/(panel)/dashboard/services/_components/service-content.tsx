import { LabelSubscription } from '@/components/label-subscription'
import { canPermission } from '@/utils/permissions/canPermission'
import { getAllServices } from '../_data-access/get-all-services'
import { ServiceList } from './service-list'

interface ServicesContentProps {
  userId: string
}

export default async function ServiceContent({ userId }: ServicesContentProps) {
  const services = await getAllServices({ userId })
  const permission = await canPermission({ type: 'service' })
  return (
    <>
      {!permission.hasPermission && (
        <LabelSubscription expired={permission.expired} />
      )}
      <ServiceList permissions={permission} services={services.data || []} />
    </>
  )
}
