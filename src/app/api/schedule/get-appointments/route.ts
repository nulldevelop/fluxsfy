import { type NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export function GET(request: NextRequest) {
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
    const startDate = new Date(year, month - 1, day, 0,0,0)
    const endDate = new Date(year, month - 1, day, 23, 59, 59, 999)

  } catch {
    return NextResponse.json(
      {
        error: 'Nenhum agendamento encontrado',
      },
      { status: 400 }
    )
  }

  return NextResponse.json({
    ok: true,
  })
}
