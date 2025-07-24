'use server'

import { z } from 'zod/v4'
import prisma from '@/lib/prisma'

const formSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório'),
  email: z.email().min(1, 'O email é obrigatório'),
  phone: z.string().min(1, 'O telefone é obrigatório'),
  date: z.date(),
  serviceId: z.string().min(1, 'O serviço é obrigatório'),
  time: z.string().min(1, 'O horário é obrigatório'),
  clinidId: z.string().min(1, 'O id da clínica é obrigatório'),
})

type FormSchema = z.infer<typeof formSchema>

export async function createNewAppointment(formData: FormSchema) {
  const schema = formSchema.safeParse(formData)

  if (schema.error) {
    return {
      error: schema.error.issues?.[0].message,
    }
  }

  try {
    const selectedDate = new Date(formData.date)
    const year = selectedDate.getFullYear()
    const month = selectedDate.getMonth()
    const day = selectedDate.getDate()
    const appointmentDate = new Date(year, month, day, 0, 0, 0, 0)

    const newAppointment = await prisma.appointment.create({
      data: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        appointmentDate,
        serviceId: formData.serviceId,
        time: formData.time,
        userId: formData.clinidId,
      },
    })

    return {
      data: newAppointment,
    }
  } catch {
    return {
      error: 'Falha ao cadastrar agendamento',
    }
  }
}
