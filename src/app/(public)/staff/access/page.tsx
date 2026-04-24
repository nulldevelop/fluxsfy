'use client'

import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Calendar, Clock, Phone, User } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

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
    refetchInterval: 20_000,
  })

  if (!token || isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-zinc-950'>
        <div className='h-12 w-12 animate-spin rounded-full border-4 border-gold border-t-transparent' />
      </div>
    )
  }

  if (!staffData) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-zinc-950 p-4'>
        <div className='rounded-2xl bg-zinc-900 p-8 text-center'>
          <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20'>
            <User className='h-8 w-8 text-red-500' />
          </div>
          <h1 className='mb-2 font-bold text-white text-xl'>Link inválido</h1>
          <p className='text-sm text-zinc-400'>
            Este link expirou ou é inválido.
          </p>
        </div>
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
    <main className='min-h-screen bg-zinc-950 text-white'>
      <div className='sticky top-0 z-10 border-zinc-800 border-b bg-zinc-950 p-4'>
        <div className='flex items-center gap-3'>
          <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gold'>
            <User className='h-5 w-5 text-black' />
          </div>
          <div>
            <p className='text-xs text-zinc-400'>Olá,</p>
            <p className='font-bold'>{staffData.name}</p>
          </div>
        </div>
      </div>

      <div className='flex items-center gap-2 px-4 py-3 text-zinc-400'>
        <Calendar className='h-4 w-4' />
        <span className='text-sm capitalize'>{dateStr}</span>
      </div>

      <div className='p-4 pb-24'>
        {loadingAppts ? (
          <div className='py-12 text-center text-zinc-500'>Carregando...</div>
        ) : appointments?.length === 0 ? (
          <div className='py-12 text-center'>
            <div className='mb-4 text-5xl'>😊</div>
            <p className='font-bold text-white'>Sem agenda hoje</p>
            <p className='text-sm text-zinc-400'> Aproveite!</p>
          </div>
        ) : (
          <div>
            <p className='mb-3 text-sm text-zinc-400'>
              {appointments?.length} agendamento(s)
            </p>

            {appointments?.map((apt) => (
              <div
                className='mb-3 rounded-xl border border-zinc-800 bg-zinc-900 p-4'
                key={apt.id}
              >
                <div className='flex items-center gap-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gold/20'>
                    <Clock className='h-5 w-5 text-gold' />
                  </div>
                  <div>
                    <p className='font-bold text-lg'>{apt.time}</p>
                    <p className='text-gold text-xs'>{apt.service.name}</p>
                  </div>
                </div>

                <div className='mt-3 pl-13'>
                  <p className='font-semibold'>{apt.name}</p>
                  <p className='flex items-center gap-1 text-sm text-zinc-400'>
                    <Phone className='h-3 w-3' />
                    {apt.phone}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .pl-13 {
          padding-left: 3.25rem;
        }
      `}</style>
    </main>
  )
}
