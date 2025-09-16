import Image from 'next/image'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className='relative h-[90vh] w-full overflow-hidden'>
      {/* Imagem de fundo */}
      <Image
        alt='Foto ilustrativa de barbearia'
        className='object-cover'
        fill
        priority
        quality={100}
        src='/banner.png'
      />

      {/* Overlay escuro */}
      <div className='absolute inset-0 bg-black/40' />

      {/* Conteúdo */}
      <div className='relative z-10 flex h-full items-center justify-center'>
        <article className='max-w-3xl space-y-8 px-4 text-center'>
          <h1 className='animate-fadeIn font-bold text-4xl text-white tracking-tight lg:text-5xl'>
            Encontre os melhores profissionais em um único local!
          </h1>
          <p className='animate-slideUp text-base text-gray-200 [animation-delay:200ms] md:text-lg'>
            A plataforma completa para profissionais e barbearias: organize seus
            atendimentos e ganhe mais tempo para o que importa.
          </p>

          <div className='flex items-center justify-center gap-4'>
            <Button className='w-fit animate-zoomIn bg-emerald-500 px-6 py-3 font-semibold [animation-delay:500ms] hover:bg-emerald-400'>
              Encontre um Profissional
            </Button>

            <Button className='w-fit animate-zoomIn bg-emerald-500 px-6 py-3 font-semibold [animation-delay:500ms] hover:bg-emerald-400'>
              <a href='/dashboard'>Sou Profissional</a>
            </Button>
          </div>
        </article>
      </div>
    </section>
  )
}
