'use server'

import { headers } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { staffId } = await request.json()

  if (!staffId) {
    return NextResponse.json(
      { error: 'Staff ID é obrigatório' },
      { status: 400 }
    )
  }

  try {
    const token = crypto.randomUUID()

    await prisma.staff.update({
      where: { id: staffId },
      data: {
        token,
        updatedAt: new Date(),
      },
    })

    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'
    const link = `${baseUrl}/staff/access?token=${token}`

    return NextResponse.json({ link })
  } catch (err) {
    console.warn(err)
    return NextResponse.json({ error: 'Erro ao gerar link' }, { status: 500 })
  }
}
