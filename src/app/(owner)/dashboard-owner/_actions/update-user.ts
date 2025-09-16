'use server'

import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function toggleUserStatus(userId: string) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') {
    return { ok: false }
  }
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) {
    return { ok: false }
  }
  await prisma.user.update({
    where: { id: userId },
    data: { status: !user.status },
  })
  return { ok: true }
}

export async function setUserRole(userId: string, role: 'USER' | 'ADMIN') {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') {
    return { ok: false }
  }
  await prisma.user.update({
    where: { id: userId },
    data: { role },
  })
  return { ok: true }
}
