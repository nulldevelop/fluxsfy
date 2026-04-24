'use client'

import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Calendar, Clock, Phone, Scissors, User } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Appointment {
  id: string
  name: string
  phone: string
  time: string
  service: { name: string }
}

export default function StaffAccessPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const { data: staffData, isLoading } = useQuery({
    queryKey: ['staff-by-token', token],
    queryFn: async () => {
      if (!token) return null
      const res = await fetch(`/api/staff/verify?token=${token}`)
      if (!res.ok) return null
      return res.json()
    },
    enabled: !!token,
  })

  const { data: appointments, isLoading: loadingAppts } = useQuery({
    queryKey: ['staff-appointments', staffData?.id],
    queryFn: async () => {
      if (!staffData?.id) return []
      const today = format(new Date(), 'yyyy-MM-dd')
      const res = await fetch(
        `/api/staff/appointments?staffId=${staffData.id}&date=${today}`
      )
      if (!res.ok) return []
      return res.json() as Promise<Appointment[]>
    },
    enabled: !!staffData?.id,
    refetchInterval: 30_000,
  })

  if (!token || isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-zinc-950'>
        <div className='animate-pulse text-gold'>Carregando...</div>
      </div>
    )
  }

  if (!staffData) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-zinc-950 p-4'>
        <Card className='max-w-md border-red-900 bg-zinc-900'>
          <CardHeader>
            <CardTitle className='text-red-500'>Link inválido</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-zinc-400'>
              Este link de acesso expirou ou é inválido.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const today = new Date()
  const dateStr = format(today, "EEEE, d 'de' MMMM")
    .replace('Sunday', 'Domingo')
    .replace('Monday', 'Segunda')
    .replace('Tuesday', 'Terça')
    .replace('Wednesday', 'Quarta')
    .replace('Thursday', 'Quinta')
    .replace('Friday', 'Sexta')
    .replace('Saturday', 'Sábado')
    .replace('January', 'Janeiro')
    .replace('February', 'Fevereiro')
    .replace('March', 'Março')
    .replace('April', 'Abril')
    .replace('May', 'Maio')
    .replace('June', 'Junho')
    .replace('July', 'Julho')
    .replace('August', 'Agosto')
    .replace('September', 'Setembro')
    .replace('October', 'Outubro')
    .replace('November', 'Novembro')
    .replace('December', 'Dezembro')

  return (
    <main className='min-h-screen bg-zinc-950 p-4'>
      <div className='mx-auto max-w-md space-y-6'>
        <Card className='border-gold bg-zinc-900'>
          <CardHeader className='border-zinc-800 border-b'>
            <div className='flex items-center gap-3'>
              <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gold/20'>
                <User className='h-6 w-6 text-gold' />
              </div>
              <div>
                <CardTitle className='text-white text-xl'>
                  Olá, {staffData.name}!
                </CardTitle>
                <p className='text-sm text-zinc-400'>{staffData.clinicName}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className='pt-4'>
            <div className='mb-4 flex items-center gap-2 text-zinc-400'>
              <Calendar className='h-4 w-4' />
              <span className='text-sm capitalize'>{dateStr}</span>
            </div>

            <h3 className='mb-3 font-bold text-white'>Agenda de hoje</h3>

            {loadingAppts ? (
              <div className='py-8 text-center text-zinc-500'>
                Carregando...
              </div>
            ) : appointments?.length === 0 ? (
              <div className='rounded-lg border border-zinc-800 border-dashed py-8 text-center'>
                <p className='text-zinc-500'>Nenhum agendamento hoje.</p>
                <p className='mt-1 text-sm text-zinc-600'>Bom trabalho! 🎉</p>
              </div>
            ) : (
              <div className='space-y-3'>
                {appointments?.map((apt) => (
                  <div
                    className='rounded-lg border border-zinc-800 bg-zinc-800/50 p-4 transition-colors hover:border-gold/50'
                    key={apt.id}
                  >
                    <div className='mb-2 flex items-start justify-between'>
                      <div className='flex items-center gap-2'>
                        <Clock className='h-4 w-4 text-gold' />
                        <span className='font-bold text-lg text-white'>
                          {apt.time}
                        </span>
                      </div>
                      <div className='flex items-center gap-1 rounded border border-gold/50 bg-gold/20 px-2 py-1 text-gold text-xs'>
                        <Scissors className='h-3 w-3' />
                        {apt.service.name}
                      </div>
                    </div>

                    <div className='space-y-1'>
                      <p className='font-semibold text-white'>{apt.name}</p>
                      <div className='flex items-center gap-1 text-sm text-zinc-400'>
                        <Phone className='h-3 w-3' />
                        <span>{apt.phone}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <p className='text-center text-xs text-zinc-600'>
          Atualiza automaticamente a cada 30s
        </p>
      </div>
    </main>
  )
}
