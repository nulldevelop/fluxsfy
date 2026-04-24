import { type NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/*
  Rota para buscar todos os agendamentos de uma clinica

  > Preciso ter a data
  > Preciso ter o id da clinica (NAO POSSO RECEBER DA ROTA req.params)
*/

export async function GET(request: NextRequest) {
  const session = await auth()

  if (!session) {
    return NextResponse.json(
      { error: 'Acesso nao autorizado!' },
      { status: 401 }
    )
  }

  const searchParams = request.nextUrl.searchParams
  const dateString = searchParams.get('date') as string
  const clinicId = session.user?.id

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
    // Criar uma data formatada
    const [year, month, day] = dateString.split('-').map(Number)

    const startDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0))
    const endDate = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999))

    const appointments = await prisma.appointment.findMany({
      where: {
        userId: clinicId,
        appointmentDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        service: true,
      },
    })

    return NextResponse.json(appointments)
  } catch (err) {
    console.warn(err)
    return NextResponse.json(
      { error: 'Falha ao buscar agendamentos' },
      { status: 400 }
    )
  }
}
)
