'use client'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { loginWithGoogle } from '@/lib/auth-client'

export function Hero() {
  async function handleLogin() {
    await loginWithGoogle()
  }
  function scrollToProfessionals() {
    const el = document.getElementById('professionals')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }
  return (
    <section className='relative h-[100vh] w-full overflow-hidden'>
      {/* Imagem de fundo */}
      <Image
        alt='Foto ilustrativa de barbearia'
        className='object-cover grayscale brightness-50'
        fill
        priority
        quality={100}
        src='/banner.png'
      />

      {/* Overlay escuro */}
      <div className='absolute inset-0 bg-black/40' />

      {/* Conteúdo */}
      <div className='relative z-10 flex h-full items-center justify-center'>
        <article className='max-w-3xl space-y-6 md:space-y-8 px-4 text-center'>
          <h1 className='animate-fadeIn font-bebas text-5xl md:text-7xl lg:text-9xl text-cream tracking-widest leading-tight md:leading-none'>
            LA ELE <br className="md:hidden" /> <span className='text-gold'>BARBEARIA</span>
          </h1>
          <div className='polo-barber mx-auto w-24 md:w-32 my-3 md:my-4' />
          <p className='animate-slideUp font-barlow text-base md:text-lg lg:text-xl text-gray-200 tracking-[.2em] md:tracking-[.4em] uppercase [animation-delay:200ms] font-bold'>
            Est. 2021 · Campina Grande do Sul
          </p>

          <div className='flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 pt-2 md:pt-4'>
            <Button
              variant="default"
              className='w-full sm:w-fit animate-zoomIn [animation-delay:500ms]'
              onClick={scrollToProfessionals}
            >
              Agendar Agora
            </Button>

            <Button
              variant="outline"
              className='w-full sm:w-fit animate-zoomIn [animation-delay:500ms]'
              onClick={handleLogin}
            >
              Ver Serviços
            </Button>
          </div>
        </article>
      </div>
    </section>
  )
}
