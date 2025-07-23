'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod/v4'

export const clinicAppointmentSchema = z.object({
  name: z.string().min(1, 'O nome e obrigatório'),
  email: z.string().min(1, 'O email e obrigatório'),
  phone: z.string().min(1, 'O telefone e obrigatório'),
  date: z.date(),
  serviceId: z.string().min(1, 'O serviço e obrigatório'),
})

export type ClinicAppointmentFormData = z.infer<typeof clinicAppointmentSchema>

export function useClinicAppointmentForm() {
  return useForm<ClinicAppointmentFormData>({
    resolver: zodResolver(clinicAppointmentSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      date: new Date(),
      serviceId: '',
    },
  })
}
