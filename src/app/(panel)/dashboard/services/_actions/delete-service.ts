'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod/v4'
import { getSession } from '@/lib/getSession'
import { prisma } from '@/lib/prisma'

const formSchema = z.object({
  serviceId: z.string().min(1, 'O Id do serviço é obrigatório'),
})

type FormSchema = z.infer<typeof formSchema>

export async function deleteService(formData: FormSchema) {
  const session = await getSession()

  if (!session?.user?.id) {
    return {
      error: 'Falha ao cadastrar  serviço',
    }
  }

  const schema = formSchema.safeParse(formData)

  if (!schema.success) {
    return {
      error: schema.error.issues[0].message,
    }
  }

  try {
    await prisma.service.update({
      where: {
        id: formData.serviceId,
        userId: session?.user?.id,
      },
      data: {
        status: false,
        updatedAt: new Date(),
      },
    })
    revalidatePath('/dashboard/services')
    return {
      data: 'Serviço deletado com sucesso',
    }
  } catch {
    return {
      error: 'Falha ao deletar  serviço',
    }
  }
}
