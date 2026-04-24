'use server'

import { type NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.json({ error: 'Token é obrigatório' }, { status: 400 })
  }

  try {
    const staff = await prisma.staff.findFirst({
      where: { token },
      include: {
        user: {
          select: { name: true },
        },
      },
    })

    if (!staff) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 404 })
    }

    return NextResponse.json({
      id: staff.id,
      name: staff.name,
      clinicName: staff.user.name,
    })
  } catch (err) {
    console.warn(err)
    return NextResponse.json(
      { error: 'Erro ao verificar token' },
      { status: 500 }
    )
  }
}
