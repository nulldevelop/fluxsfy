'use server'

import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/getSession'
import { prisma } from '@/lib/prisma'
import z from 'zod/v4'

const staffSchema = z.object({
  name: z.string().min(2, 'O nome é obrigatório'),
  phone: z.string().optional(),
  image: z.string().optional(),
  times: z.array(z.string()),
  services: z.array(z.string()),
  status: z.boolean().default(true),
})

export async function createStaff(data: z.infer<typeof staffSchema>) {
  const session = await getSession()
  if (!session?.user?.id) {
    return { error: 'Não autorizado' }
  }

  try {
    await prisma.staff.create({
      data: {
        name: data.name,
        phone: data.phone,
        image: data.image,
        times: data.times,
        status: data.status,
        userId: session.user.id,
        service: {
          connect: data.services.map((id) => ({ id })),
        },
      },
    })

    revalidatePath('/dashboard/staff')
    return { data: 'Funcionário criado com sucesso' }
  } catch (error) {
    console.error(error)
    return { error: 'Falha ao criar funcionário' }
  }
}

export async function updateStaff(id: string, data: z.infer<typeof staffSchema>) {
  const session = await getSession()
  if (!session?.user?.id) {
    return { error: 'Não autorizado' }
  }

  try {
    await prisma.staff.update({
      where: { id, userId: session.user.id },
      data: {
        name: data.name,
        phone: data.phone,
        image: data.image,
        times: data.times,
        status: data.status,
        service: {
          set: data.services.map((id) => ({ id })),
        },
      },
    })

    revalidatePath('/dashboard/staff')
    return { data: 'Funcionário atualizado com sucesso' }
  } catch (error) {
    console.error(error)
    return { error: 'Falha ao atualizar funcionário' }
  }
}

export async function deleteStaff(id: string) {
  const session = await getSession()
  if (!session?.user?.id) {
    return { error: 'Não autorizado' }
  }

  try {
    await prisma.staff.delete({
      where: { id, userId: session.user.id },
    })

    revalidatePath('/dashboard/staff')
    return { data: 'Funcionário removido com sucesso' }
  } catch (error) {
    console.error(error)
    return { error: 'Falha ao remover funcionário' }
  }
}
