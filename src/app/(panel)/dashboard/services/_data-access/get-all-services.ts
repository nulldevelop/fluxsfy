'use server'

import { prisma } from '@/lib/prisma'

export async function getAllServices({ userId }: { userId: string }) {
  if (!userId) {
    return {
      error: 'Falaha ao buscar serviços',
    }
  }

  try {
    const services = await prisma.service.findMany({
      where: {
        userId,
        status: true,
      },
    })

    return {
      data: services,
    }
  } catch (_err) {
    return {
      error: 'Falha ao buscar serviços',
    }
  }
}
