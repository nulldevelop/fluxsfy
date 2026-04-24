'use server'

import { prisma } from '@/lib/prisma'

export async function getInfoSchedule({ userId }: { userId: string }) {
  try {
    if (!userId) {
      return null
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ id: userId }, { slug: userId }],
      },
      include: {
        subscription: true,
        service: {
          where: {
            status: true,
          },
        },
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

    if (!user) {
      return null
    }

    return user
  } catch {
    return null
  }
}
