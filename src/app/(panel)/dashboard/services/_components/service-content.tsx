import { getAllServices } from '../_data-access/get-all-services'
import { ServiceList } from './service-list'

interface ServicesContentProps {
  userId: string
}

export default async function ServiceContent({ userId }: ServicesContentProps) {
  const services = await getAllServices({ userId })
  return <ServiceList services={services.data || []} />
}
