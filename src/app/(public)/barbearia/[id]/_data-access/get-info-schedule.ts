'use server'

import { prisma } from '@/lib/prisma'

export async function getInfoSchedule({ userId }: { userId: string }) {
  // Always fetch fresh data
  await new Promise((resolve) => setTimeout(resolve, 100))
  try {
    if (!userId) {
      return null
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ id: userId }, { slug: userId }],
      },
      select: {
        id: true,
        name: true,
        image: true,
        address: true,
        phone: true,
        status: true,
        times: true,
        subscription: true,
        services: {
          where: {
            status: true,
          },
        },
        staff: {
          where: {
            status: true,
          },
          select: {
            id: true,
            name: true,
            times: true,
            services: {
              select: {
                id: true,
                name: true,
                duration: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    if (!user) {
      return null
    }

    return user
  } catch {
    return null
  }
}
