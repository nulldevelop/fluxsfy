'use server'

import { prisma } from '@/lib/prisma'

export async function getProfessionals() {
  try {
    const professionals = await prisma.user.findMany({
      where: {
        status: true,
      },
      include: {
        subscription: true,
        staff: {
          where: {
            status: true,
          },
          include: {
            service: true,
          },
        },
      },
    })

    return professionals
  } catch (error) {
    console.error('Error fetching professionals:', error)
    return []
  }
}
