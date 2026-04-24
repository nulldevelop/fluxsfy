import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { formatCurrency } from '@/utils/formatCurrency'
import type { AppointmentWithService } from './appointments-list'

interface DialogAppointmentProps {
  appointment: AppointmentWithService | null
}

export function DialogAppointment({ appointment }: DialogAppointmentProps) {
  console.info(appointment)
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Detalhes do agendamento</DialogTitle>
      </DialogHeader>

      <div className='py-4'>
        {appointment && (
          <div className='flex flex-col gap-2'>
            <p className='font-semibold text-sm'>Hora: {appointment.time}</p>
            <p className='mb-2 font-semibold text-sm'>
              Hora:{' '}
              {new Intl.DateTimeFormat('pt-BR', {
                timeZone: 'UTC',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              }).format(new Date(appointment.appointmentDate))}
            </p>
            <p className='font-semibold text-sm'>Nome: {appointment.name}</p>
            <p className='font-semibold text-sm'>
              Telefone: {appointment.phone}
            </p>
            <p className='font-semibold text-sm'>Email: {appointment.email}</p>
            <span className='mt-4 bg-gray-200 p-2 text-sm'>
              <p className=' rounded-md font-semibold'>
                Serviço: {appointment.service.name}
              </p>
              {appointment.staff && (
                <p className='font-semibold'>
                  Profissional: {appointment.staff.name}
                </p>
              )}
              <p className='font-semibold text-sm'>
                Valor: {formatCurrency(appointment.service.price / 100)}
              </p>
            </span>
          </div>
        )}
      </div>
    </DialogContent>
  )
}
