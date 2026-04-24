'use server'

import { prisma } from '@/lib/prisma'

export async function getStaff({ userId }: { userId: string }) {
  if (!userId) {
    return {
      error: 'Falha ao buscar funcionários',
    }
  }

  try {
    const staff = await prisma.staff.findMany({
      where: {
        userId,
      },
      include: {
        service: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return {
      data: staff,
    }
  } catch (_err) {
    return {
      error: 'Falha ao buscar funcionários',
    }
  }
}
