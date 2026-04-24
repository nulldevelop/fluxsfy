import type { Prisma } from '@prisma/client'
import { ArrowRight, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { PremiumBadge } from './premium'
import { Rating } from './ratingstar'

type UserWithStaffAndServices = Prisma.UserGetPayload<{
  include: {
    subscription: true
    staff: {
      include: {
        service: true
      }
    }
  }
}>

interface ProfessionalsProps {
  professionals: UserWithStaffAndServices[]
}

export function Professionals({ professionals }: ProfessionalsProps) {
  // Flat list of all staff members from all barbershops
  const allStaff = professionals.flatMap(barbershop => 
    barbershop.staff.map(member => ({
      ...member,
      barbershopName: barbershop.name,
      barbershopId: barbershop.id,
      barbershopSlug: barbershop.slug,
      barbershopPlan: barbershop.subscription?.plan
    }))
  )
// ... (omitted for brevity in thinking, but I must provide full new_string in tool call)

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
          {allStaff.map((member) => (
            <Card
              className='group overflow-hidden bg-zinc-900 border-l-4 border-gold h-full flex flex-col'
              key={member.id}
            >
              <CardContent className='p-0 flex flex-col h-full'>
                <div>
                  <div className='relative h-64 w-full bg-zinc-800 flex items-center justify-center'>
                    {member.image ? (
                        <Image
                            alt={`Foto de ${member.name}`}
                            className='object-cover grayscale group-hover:grayscale-0 transition-all duration-500'
                            fill
                            src={member.image}
                        />
                    ) : (
                        <User className="h-20 w-24 text-zinc-700" />
                    )}
                    
                    {member.barbershopPlan && (
                      <PremiumBadge
                        plan={
                          member.barbershopPlan as 'BASIC' | 'PLUS' | 'PRO'
                        }
                      />
                    )}
                  </div>
                </div>

                <div className='flex flex-col justify-between flex-1 space-y-4 p-6'>
                  <div>
                    <h3 className='font-bebas text-3xl text-cream tracking-wider'>
                      {member.name}
                    </h3>
                    <p className='text-gold text-xs font-bold uppercase tracking-widest mb-2'>
                        {member.barbershopName}
                    </p>
                    <Rating value={5} />
                    
                    <div className='mt-4'>
                        <p className='font-barlow text-gray-500 text-[10px] uppercase tracking-widest font-bold mb-1'>Serviços:</p>
                        <div className='flex flex-wrap gap-1'>
                            {member.service.slice(0, 3).map(service => (
                                <span key={service.id} className='px-2 py-0.5 bg-zinc-800 text-cream text-[9px] rounded-full uppercase tracking-tighter'>
                                    {service.name}
                                </span>
                            ))}
                            {member.service.length > 3 && (
                                <span className='text-[9px] text-gray-600'>+{member.service.length - 3} mais</span>
                            )}
                        </div>
                    </div>
                  </div>

                  <Link
                    className='btn-primary-clipped flex items-center justify-center gap-2 mt-auto'
                    href={`/barbearia/${member.barbershopSlug || member.barbershopId}`}
                    target='_blank'
                  >
                    Agendar Horário
                    <ArrowRight className='size-4' />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {allStaff.length === 0 && (
             <div className='col-span-full py-10 text-center text-gray-500 font-barlow uppercase tracking-widest'>
                Nenhum profissional disponível no momento.
             </div>
          )}
        </section>
      </div>
    </section>
  )
}
