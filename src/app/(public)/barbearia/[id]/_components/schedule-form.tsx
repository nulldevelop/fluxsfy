'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const appointmentSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório'),
  email: z.string().email('O email é obrigatório'),
  phone: z.string().min(1, 'O telefone é obrigatório'),
  date: z.string(),
  serviceId: z.string().min(1, 'O serviço é obrigatório'),
  staffId: z.string().min(1, 'O profissional é obrigatório'),
})

export type AppointmentFormData = z.infer<typeof appointmentSchema>

export function useAppointmentForm() {
  return useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      serviceId: '',
      staffId: '',
      date: new Date().toISOString().split('T')[0],
    },
  })
}
