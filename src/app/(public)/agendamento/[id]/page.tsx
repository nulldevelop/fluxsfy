import { CheckCircle2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Toaster } from '@/components/ui/sonner'
import { prisma } from '@/lib/prisma'

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
    <main className='dark min-h-screen bg-background text-foreground font-barlow'>
      <Toaster duration={2500} theme='dark' richColors />
      {/* Polo Barber Top */}
      <div className='fixed top-0 left-0 right-0 z-50'>
        <div className='polo-barber' />
      </div>

      {/* Hero/banner */}
      <section className='relative h-[45vh] w-full overflow-hidden'>
        <Image
          alt='Banner de confirmação'
          className='object-cover grayscale brightness-50'
          fill
          priority
          quality={100}
          src='/banner.png'
        />
        <div className='absolute inset-0 bg-black/50' />

        <div className='relative z-10 flex h-full items-center justify-center px-4'>
          <div className='text-center'>
            <h1 className='font-bebas text-5xl md:text-7xl text-cream tracking-[0.2em] uppercase'>
              Agendamento confirmado
            </h1>
            <div className='polo-barber w-32 mx-auto my-6' />
            <p className='font-barlow text-gold text-sm md:text-lg tracking-[0.3em] uppercase font-bold'>
              Veja abaixo os detalhes do seu atendimento
            </p>
          </div>
        </div>
      </section>

      {/* Card de comprovante */}
      <section className='container mx-auto max-w-2xl px-4 pb-16'>
        <Card className='-mt-16 md:-mt-20 border-l-8 border-gold bg-black p-8 md:p-10 shadow-2xl backdrop-blur relative z-10'>
          <div className='mb-8 flex flex-col items-center justify-center gap-3'>
            <CheckCircle2 className='h-12 w-12 text-gold' />
            <span className='font-bebas text-3xl text-cream tracking-widest uppercase mt-2'>
              Comprovante
            </span>
            <div className='h-1 w-20 bg-gold' />
          </div>

          <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
            <div className='space-y-4'>
              <div>
                <span className='text-zinc-500 text-xs font-bold uppercase tracking-widest'>Nome</span>
                <p className='font-bebas text-xl text-gold tracking-wider'>{appointment.name}</p>
              </div>
              <div>
                <span className='text-zinc-500 text-xs font-bold uppercase tracking-widest'>Email</span>
                <p className='font-barlow text-cream tracking-wider'>{appointment.email}</p>
              </div>
              <div>
                <span className='text-zinc-500 text-xs font-bold uppercase tracking-widest'>Telefone</span>
                <p className='font-barlow text-cream tracking-wider'>{appointment.phone}</p>
              </div>
            </div>

            <div className='space-y-4'>
              <div>
                <span className='text-zinc-500 text-xs font-bold uppercase tracking-widest'>Barbearia</span>
                <p className='font-bebas text-xl text-gold tracking-wider'>
                  {appointment.user?.name}
                </p>
              </div>
              <div>
                <span className='text-zinc-500 text-xs font-bold uppercase tracking-widest'>Serviço</span>
                <p className='font-barlow text-cream tracking-wider'>
                  {appointment.service?.name}
                </p>
              </div>
              <div>
                <span className='text-zinc-500 text-xs font-bold uppercase tracking-widest'>Data e hora</span>
                <p className='font-barlow text-cream tracking-wider'>{localDateTime}</p>
              </div>
            </div>
          </div>

<<<<<<< HEAD
          <div className='mt-8 flex items-center justify-center gap-3'>
            <a
              className='rounded-md bg-emerald-500 px-4 py-2 font-medium text-white transition-colors hover:bg-emerald-400'
              href='/'
            >
              Voltar ao início
            </a>
            <a
              className='rounded-md border border-zinc-700 bg-zinc-800 px-4 py-2 font-medium text-white transition-colors hover:border-zinc-600 hover:bg-zinc-700'
              href={`/barbearia/${appointment.userId}`}
              target='_blank'
            >
              Ver página da barbearia
            </a>
=======
          <div className='mt-12 flex flex-col md:flex-row items-center justify-center gap-4'>
            <Button variant="default" asChild className="w-full md:w-auto">
              <Link href="/">Voltar ao início</Link>
            </Button>
            <Button variant="outline" asChild className="w-full md:w-auto">
              <Link href={`/clinica/${appointment.userId}`} target='_blank'>
                Ver página da barbearia
              </Link>
            </Button>
>>>>>>> f4f66b1eca0c3cf2ea27fc55f09d9ee13ac98a1b
          </div>
        </Card>
      </section>
    </main>
  )
}
