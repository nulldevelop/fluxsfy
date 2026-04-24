import type { Prisma } from '@prisma/client'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { PremiumBadge } from './premium'
import { Rating } from './ratingstar'

type UserWithSubscription = Prisma.UserGetPayload<{
  include: {
    subscription: true
  }
}>

interface ProfessionalsProps {
  professionals: UserWithSubscription[]
}

export function Professionals({ professionals }: ProfessionalsProps) {
  return (
    <section
      className='relative overflow-hidden bg-black py-16'
      id='professionals'
    >
      {/* Glow radial decorativo */}
      <div className='pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(1200px_600px_at_50%_-10%,rgba(212,160,23,0.1),transparent_60%)]' />

      <div className='container relative z-10 mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Título com subtítulo */}
        <div className='mx-auto mb-12 max-w-3xl text-center'>
          <h2 className='font-bebas text-4xl md:text-5xl text-gold tracking-widest'>
            Nossos Profissionais
          </h2>
          <div className='polo-barber mx-auto w-24 my-3 md:my-4' />
          <p className='mt-2 md:mt-3 font-barlow text-gray-400 uppercase tracking-[0.15em] md:tracking-widest font-bold text-sm md:text-base'>
            Equipe altamente qualificada para garantir o melhor corte da região.
          </p>
        </div>

        <section className='grid grid-cols-1 gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-4'>
          {professionals.map((clinic) => (
            <Card
              className='group overflow-hidden bg-zinc-900 border-l-4 border-gold'
              key={clinic.id}
            >
              <CardContent className='p-0'>
                <div>
                  <div className='relative h-64'>
                    <Image
                      alt='Foto do profissional'
                      className='object-cover grayscale group-hover:grayscale-0 transition-all duration-500'
                      fill
                      src={clinic.image || '/medic1.png'}
                    />
                    {clinic?.subscription?.plan && (
                      <PremiumBadge
                        plan={
                          clinic.subscription.plan as 'BASIC' | 'PLUS' | 'PRO'
                        }
                      />
                    )}
                  </div>
                </div>

                <div className='flex flex-col justify-between space-y-4 p-6'>
                  <div>
                    <h3 className='font-bebas text-3xl text-cream tracking-wider'>
                      {clinic.name}
                    </h3>
                    <Rating value={clinic.rating || 3} />
                    <p className='line-clamp-2 font-barlow text-gray-500 text-sm uppercase tracking-widest mt-2'>
                      Especialista em {clinic.address ? 'Cortes Modernos' : 'Barba e Cabelo'}
                    </p>
                  </div>

                  <Link
                    className='btn-primary-clipped flex items-center justify-center gap-2'
                    href={`/clinica/${clinic.id}`}
                    target='_blank'
                  >
                    Agendar Horário
                    <ArrowRight className='size-4' />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </section>
  )
}
