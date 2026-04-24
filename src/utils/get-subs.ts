'use server'

import { prisma } from '@/lib/prisma'

export async function getSubs(userId: string) {
  if (!userId) {
    return null
  }

  try {
    const subs = await prisma.subscription.findFirst({
      where: {
        userId,
      },
    })

    return subs
  } catch {
    return null
  }
}
