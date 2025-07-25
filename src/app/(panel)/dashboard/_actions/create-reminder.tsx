'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod/v4'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

const formSchema = z.object({
  description: z.string().min(1, 'A descrição é obrigatório'),
})

type FormSchma = z.infer<typeof formSchema>

export async function createReminder(formdata: FormSchma) {
  const session = await auth()

  if (!session?.user?.id) {
    return {
      error: 'Falha ao cadastrar lembrete',
    }
  }

  const schema = formSchema.safeParse(formdata)

  if (!schema.success) {
    return {
      error: schema.error.issues[0].message,
    }
  }

  try {
    await prisma.reminder.create({
      data: {
        description: formdata.description,
        userId: session?.user?.id,
      },
    })

    revalidatePath('/dashboard')
    return {
      data: 'Lembrete cadastrado com sucesso',
    }
  } catch {
    return {
      error: 'Falha ao cadastrar lembrete',
    }
  }
}
