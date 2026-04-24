'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod/v4'
import { getSession } from '@/lib/getSession'
import { prisma } from '@/lib/prisma'

const formSchema = z.object({
  appointmentIs: z.string().min(1, 'O id do agendamento é obrigatório'),
})

type FormSchma = z.infer<typeof formSchema>

export async function cancelAppointment(data: FormSchma) {
  const schema = formSchema.safeParse(data)

  if (!schema.success) {
    return {
      error: schema.error.issues[0].message,
    }
  }
  const session = await getSession()

  if (!session?.user?.id) {
    return {
      error: 'Usuário nao encontrado',
    }
  }

  try {
    await prisma.appointment.delete({
      where: {
        id: data.appointmentIs,
        userId: session.user?.id,
      },
    })

    revalidatePath('/dashboard')
    return {
      data: 'Agendamento cancelado com sucesso',
    }
  } catch {
    return {
      error: 'Falha ao cancelar agendamento',
    }
  }
}
