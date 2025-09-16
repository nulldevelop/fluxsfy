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
    <section className='bg-zinc-900 py-16'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Título em branco para contraste */}
        <h2 className='mb-12 text-center font-bold text-3xl text-white'>
          Barbearias disponíveis
        </h2>

        <section className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {professionals.map((clinic) => (
            <Card
              className='overflow-hidden border border-zinc-700 bg-zinc-800 duration-200 hover:shadow-lg'
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
