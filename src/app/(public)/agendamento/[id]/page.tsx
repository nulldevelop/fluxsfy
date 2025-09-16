import { CheckCircle2 } from 'lucide-react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'

function formatLocalDateTime(date: Date, time: string) {
  const [hourStr, minuteStr] = time.split(':')
  const utcDate = new Date(date)
  const local = new Date(
    utcDate.getUTCFullYear(),
    utcDate.getUTCMonth(),
    utcDate.getUTCDate(),
    Number(hourStr),
    Number(minuteStr)
  )
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(local)
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: {
      service: true,
      user: true,
    },
  })

  if (!appointment) {
    return notFound()
  }

  const localDateTime = formatLocalDateTime(
    appointment.appointmentDate,
    appointment.time
  )

  return (
    <main className='min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 text-white'>
      {/* Hero/banner */}
      <section className='relative h-[45vh] w-full overflow-hidden'>
        <Image
          alt='Banner de confirmação'
          className='object-cover'
          fill
          priority
          quality={100}
          src='/banner.png'
        />
        <div className='absolute inset-0 bg-black/50' />

        <div className='relative z-10 flex h-full items-center justify-center px-4'>
          <div className='text-center'>
            <h1 className='font-bold text-3xl tracking-tight md:text-4xl'>
              Agendamento confirmado
            </h1>
            <p className='mt-3 text-gray-200'>
              Veja abaixo os detalhes do seu atendimento.
            </p>
          </div>
        </div>
      </section>

      {/* Glow decorativo */}
      <div className='pointer-events-none mx-auto max-w-6xl px-4 [background:radial-gradient(900px_400px_at_50%_-50%,rgba(16,185,129,0.15),transparent_60%)]' />

      {/* Card de comprovante */}
      <section className='container mx-auto max-w-2xl px-4 pb-16'>
        <div className='-mt-16 md:-mt-20 rounded-xl border border-zinc-800 bg-white/10 p-6 shadow-2xl backdrop-blur'>
          <div className='mb-5 flex items-center justify-center gap-3'>
            <CheckCircle2 className='h-7 w-7 text-emerald-400' />
            <span className='font-semibold text-xl'>
              Comprovante do agendamento
            </span>
          </div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div className='space-y-2'>
              <div>
                <span className='text-gray-300'>Nome</span>
                <p className='font-medium text-white'>{appointment.name}</p>
              </div>
              <div>
                <span className='text-gray-300'>Email</span>
                <p className='font-medium text-white'>{appointment.email}</p>
              </div>
              <div>
                <span className='text-gray-300'>Telefone</span>
                <p className='font-medium text-white'>{appointment.phone}</p>
              </div>
            </div>

            <div className='space-y-2'>
              <div>
                <span className='text-gray-300'>Barbearia</span>
                <p className='font-medium text-white'>
                  {appointment.user?.name}
                </p>
              </div>
              <div>
                <span className='text-gray-300'>Serviço</span>
                <p className='font-medium text-white'>
                  {appointment.service?.name}
                </p>
              </div>
              <div>
                <span className='text-gray-300'>Data e hora (local)</span>
                <p className='font-medium text-white'>{localDateTime}</p>
              </div>
            </div>
          </div>

          <div className='mt-8 flex items-center justify-center gap-3'>
            <a
              className='rounded-md bg-emerald-500 px-4 py-2 font-medium text-white transition-colors hover:bg-emerald-400'
              href='/'
            >
              Voltar ao início
            </a>
            <a
              className='rounded-md border border-zinc-700 bg-zinc-800 px-4 py-2 font-medium text-white transition-colors hover:border-zinc-600 hover:bg-zinc-700'
              href={`/clinica/${appointment.userId}`}
              target='_blank'
            >
              Ver página da barbearia
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
