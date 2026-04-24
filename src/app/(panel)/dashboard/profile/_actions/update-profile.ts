'use server'

import { revalidatePath } from 'next/cache'
import z from 'zod/v4'
import { getSession } from '@/lib/getSession'
import { prisma } from '@/lib/prisma'

const formSchema = z.object({
  name: z.string().min(2, 'O nome é obrigatório!'),
  address: z.string().optional(),
  phone: z.string().optional(),
  status: z.boolean(),
  timeZone: z.string().min(1, 'O time zone é obrigatório!'),
  times: z.array(z.string()),
  slug: z.string().optional().transform(v => v ? v.toLowerCase().replace(/ /g, '-') : undefined),
})

type FormSchema = z.infer<typeof formSchema>

export async function updateProfile(formData: FormSchema) {
  const session = await getSession()

  if (!session?.user?.id) {
    return {
      error: 'Usuário não encontrado',
    }
  }

  const schema = formSchema.safeParse(formData)

  if (!schema.success) {
    return {
      error: 'Preencha todos os campos',
    }
  }

  try {
    // Check if slug is already taken
    if (formData.slug) {
      const existingUser = await prisma.user.findFirst({
        where: { slug: formData.slug }
      })

      if (existingUser && existingUser.id !== session.user.id) {
        return {
          error: 'Este nome amigável já está em uso!',
        }
      }
    }

    await prisma.user.update({
      where: {
        id: session?.user?.id,
      },
      data: {
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        timeZone: formData.timeZone,
        times: formData.times || [],
        slug: formData.slug || null,
      },
    })

    revalidatePath('/dashboard/profile')
    return {
      data: 'Clinica atualizada com sucesso!',
    }
  } catch (err) {
    console.warn(err)
    return {
      error: 'Falha ao atualizar a clinica!',
    }
  }
}
