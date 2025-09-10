import { type NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl

  const userId = searchParams.get('userId')
  const dateParam = searchParams.get('date')

  if (!(userId && dateParam)) {
    return NextResponse.json(
      {
        error: 'Nenhum agendamento encontrado',
      },
      { status: 400 }
    )
  }

  try {
    const [year, month, day] = dateParam.split('-').map(Number)
    const startDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0))
    const endDate = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999))
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    })
    if (!user) {
      return NextResponse.json(
        {
          error: 'Nenhum agendamento encontrado',
        },
        {
          status: 400,
        }
      )
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        userId,
        appointmentDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        service: true,
      },
    })

    const blockedSlots = new Set<string>()

    for (const apt of appointments) {
      const requiredSlots = Math.ceil(apt.service.duration / 30)
      const startIndex = user.times.indexOf(apt.time)

      if (startIndex !== -1) {
        for (let i = 0; i < requiredSlots; i++) {
          const blokedSlot = user.times[startIndex + i]
          if (blokedSlot) {
            blockedSlots.add(blokedSlot)
          }
        }
      }
    }

    const blockedTimes = Array.from(blockedSlots)

    return NextResponse.json(blockedTimes)
  } catch {
    return NextResponse.json(
      {
        error: 'Nenhum agendamento encontrado',
      },
      { status: 400 }
    )
  }
}
