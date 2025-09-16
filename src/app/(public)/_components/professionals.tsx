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
      className='relative overflow-hidden bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 py-16'
      id='professionals'
    >
      {/* Glow radial decorativo */}
      <div className='pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(1200px_600px_at_50%_-10%,rgba(16,185,129,0.18),transparent_60%)]' />

      <div className='container relative z-10 mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Título com subtítulo */}
        <div className='mx-auto mb-12 max-w-3xl text-center'>
          <h2 className='font-bold text-3xl text-white md:text-4xl'>
            Barbearias disponíveis
          </h2>
          <p className='mt-3 text-gray-300'>
            Explore barbearias próximas de você com avaliações e planos em
            destaque.
          </p>
        </div>

        <section className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {professionals.map((clinic) => (
            <Card
              className='hover:-translate-y-1 overflow-hidden border border-zinc-700 bg-zinc-800 transition-all duration-200 hover:shadow-lg hover:ring-1 hover:ring-emerald-400/30'
              key={clinic.id}
            >
              <CardContent className='p-0'>
                <div>
                  <div className='relative h-48'>
                    <Image
                      alt='Foto da clinica'
                      className='object-cover'
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

                <div className='flex min-h-[160px] flex-col justify-between space-y-4 p-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <h3 className='font-semibold text-white'>
                        {clinic.name}
                      </h3>
                      <Rating value={clinic.rating || 3} />
                      <p className='line-clamp-2 text-gray-400 text-sm'>
                        {clinic.address}
                      </p>
                    </div>
                  </div>

                  <Link
                    className='flex w-full items-center justify-center rounded-md bg-emerald-500 py-2 font-medium text-sm text-white hover:bg-emerald-400 md:text-base'
                    href={`/clinica/${clinic.id}`}
                    target='_blank'
                  >
                    Agendar horário
                    <ArrowRight className='ml-2' />
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
