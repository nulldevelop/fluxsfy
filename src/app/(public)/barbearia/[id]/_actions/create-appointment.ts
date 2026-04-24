'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const formSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório'),
  email: z.string().email('O email é obrigatório'),
  phone: z.string().min(1, 'O telefone é obrigatório'),
  date: z.string(),
  serviceId: z.string().min(1, 'O serviço é obrigatório'),
  staffId: z.string().min(1, 'O profissional é obrigatório'),
  time: z.string().min(1, 'O horário é obrigatório'),
  clinicId: z.string().min(1, 'O horário é obrigatório'),
})

type FormSchema = z.infer<typeof formSchema>

export async function createNewAppointment(formData: FormSchema) {
  const schema = formSchema.safeParse(formData)

  if (!schema.success) {
    return {
      error: schema.error.issues[0].message,
    }
  }

  try {
    const dateOnly = formData.date.split('T')[0]
    const [year, month, day] = dateOnly.split('-').map(Number)
    const appointmentDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0))

    const newAppointment = await prisma.appointment.create({
      data: {
        id: crypto.randomUUID(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        time: formData.time,
        appointmentDate,
        serviceId: formData.serviceId,
        staffId: formData.staffId,
        userId: formData.clinicId,
        updatedAt: new Date(),
      },
    })

    return {
      data: newAppointment,
    }
  } catch (err) {
    return {
      error: 'Erro ao cadastrar agendamento',
    }
  }
}
