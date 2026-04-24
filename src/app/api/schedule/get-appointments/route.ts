import { type NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl

  const userId = searchParams.get('userId')
  const staffId = searchParams.get('staffId')
  const dateParam = searchParams.get('date')

  if (!((userId || staffId) && dateParam)) {
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
    
    let availableTimes: string[] = []
    let appointmentsWhere: any = {
      appointmentDate: {
        gte: startDate,
        lte: endDate,
      },
    }

    if (staffId) {
      const staff = await prisma.staff.findUnique({
        where: { id: staffId },
      })
      if (!staff) return NextResponse.json([], { status: 404 })
      availableTimes = staff.times as string[]
      appointmentsWhere.staffId = staffId
    } else {
      const user = await prisma.user.findFirst({
        where: { id: userId! },
      })
      if (!user) return NextResponse.json([], { status: 404 })
      availableTimes = user.times as string[]
      appointmentsWhere.userId = userId
    }

    const appointments = await prisma.appointment.findMany({
      where: appointmentsWhere,
      include: {
        service: true,
      },
    })

    const blockedSlots = new Set<string>()

    for (const apt of appointments) {
      const requiredSlots = Math.ceil(apt.service.duration / 30)
      const startIndex = availableTimes.indexOf(apt.time)

      if (startIndex !== -1) {
        for (let i = 0; i < requiredSlots; i++) {
          const blokedSlot = availableTimes[startIndex + i]
          if (blokedSlot) {
            blockedSlots.add(blokedSlot)
          }
        }
      }
    }

    return NextResponse.json(Array.from(blockedSlots))
  } catch {
    return NextResponse.json(
      {
        error: 'Nenhum agendamento encontrado',
      },
      { status: 400 }
    )
  }
}
