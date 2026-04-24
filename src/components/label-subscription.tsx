import Link from 'next/link'

export function LabelSubscription({ expired }: { expired: boolean }) {
  return (
    <div className='my-6 flex flex-col items-center justify-between gap-4 border-black border-l-8 bg-barber-red p-6 md:flex-row'>
      <div className='text-center md:text-left'>
        {expired ? (
          <h3 className='font-bebas text-2xl text-white tracking-widest'>
            Plano Inativo ou Expirado
          </h3>
        ) : (
          <h3 className='font-bebas text-2xl text-white tracking-widest'>
            Limite do Plano Atingido!
          </h3>
        )}
        <p className='font-barlow font-bold text-sm text-white/80 uppercase tracking-widest'>
          Acesse a área de planos para continuar utilizando todos os recursos da
          sua barbearia.
        </p>
      </div>

      <Link
        className='bg-black px-8 py-2 font-barlow font-extrabold text-white uppercase tracking-[0.3em] transition-colors [clip-path:polygon(8px_0%,100%_0%,calc(100%-8px)_100%,0%_100%)] hover:bg-zinc-900'
        href={'/dashboard/plans'}
      >
        Ver planos
      </Link>
    </div>
  )
}
