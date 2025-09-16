'use server'

import prisma from '@/lib/prisma'

export async function getUsersWithSubscription() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      subscription: true,
      _count: { select: { services: true, appointments: true } },
    },
  })

  return users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    status: u.status,
    role: u.role,
    createdAt: u.createdAt,
    plan: u.subscription?.plan ?? null,
    subscriptionStatus: u.subscription?.status ?? null,
    servicesCount: u._count.services,
    appointmentsCount: u._count.appointments,
  }))
}
