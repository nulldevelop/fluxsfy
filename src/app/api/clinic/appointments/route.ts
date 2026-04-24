import { headers } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return NextResponse.json(
      { error: 'Acesso nao autorizado!' },
      { status: 401 }
    )
  }

  const searchParams = request.nextUrl.searchParams
  const dateString = searchParams.get('date') as string
  const staffId = searchParams.get('staffId') as string
  const clinicId = session.user.id

  if (!dateString) {
    return NextResponse.json({ error: 'Data não informada!' }, { status: 400 })
  }

  if (!clinicId) {
    return NextResponse.json(
      { error: 'Usuário não encontrado' },
      { status: 400 }
    )
  }

  try {
    const [year, month, day] = dateString.split('-').map(Number)

    const startDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0))
    const endDate = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999))

    const appointments = await prisma.appointment.findMany({
      where: {
        userId: clinicId,
      },
      include: {
        service: true,
        staff: true,
      },
      orderBy: {
        appointmentDate: 'asc',
      },
    })

    const filtered = appointments.filter((apt) => {
      if (staffId && staffId !== 'all' && apt.staffId !== staffId) {
        return false
      }
      const aptDate = new Date(apt.appointmentDate)
      const aptDay = `${aptDate.getUTCFullYear()}-${String(aptDate.getUTCMonth() + 1).padStart(2, '0')}-${String(aptDate.getUTCDate()).padStart(2, '0')}`
      return aptDay === dateString
    })

    return NextResponse.json(filtered)
  } catch (err) {
    console.warn(err)
    return NextResponse.json(
      { error: 'Falha ao buscar agendamentos' },
      { status: 400 }
    )
  }
}
