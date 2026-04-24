'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod/v4'
import { prisma } from '@/lib/prisma'

const formSchema = z.object({
  reminderId: z.string().min(1, 'O id do lembrete é obrigatório'),
})

type FormSchema = z.infer<typeof formSchema>

export async function deleteReminder(formData: FormSchema) {
  const schema = formSchema.safeParse(formData)

  if (!schema.success) {
    return {
      error: schema.error.issues[0].message,
    }
  }

  try {
    await prisma.reminder.delete({
      where: {
        id: formData.reminderId,
      },
    })

    revalidatePath('/dashboard')
    return {
      data: 'Lembrete deletado com sucesso',
    }
  } catch {
    return {
      error: 'Falha ao deletar lembrete',
    }
  }
}
