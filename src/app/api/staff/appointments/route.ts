'use server'

import { type NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const staffId = searchParams.get('staffId')
  const date = searchParams.get('date')

  if (!(staffId && date)) {
    return NextResponse.json(
      { error: 'Staff ID e data são obrigatórios' },
      { status: 400 }
    )
  }

  try {
    const [year, month, day] = date.split('-').map(Number)

    const startDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0))
    const endDate = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999))

    const appointments = await prisma.appointment.findMany({
      where: {
        staffId,
        appointmentDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        service: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        time: 'asc',
      },
    })

    const result = appointments.map((apt) => ({
      id: apt.id,
      name: apt.name,
      phone: apt.phone,
      time: apt.time,
      service: apt.service,
    }))

    return NextResponse.json(result)
  } catch (err) {
    console.warn(err)
    return NextResponse.json(
      { error: 'Erro ao buscar agendamentos' },
      { status: 500 }
    )
  }
}
