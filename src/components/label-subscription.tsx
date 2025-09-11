import Link from 'next/link'

export function LabelSubscription({ expired }: { expired: boolean }) {
  return (
    <div className='md:itens-center my-4 flex flex-col justify-between gap-1 rounded-lg bg-red-400 px-3 py-2 text-sm text-white md:flex-row md:text-base'>
      <div>
        {expired ? (
          <h3 className='font-semibold'>Seu plano expirou ou não está ativo</h3>
        ) : (
          <h3 className='font-semibold'>Você excedeu o limite do plano!</h3>
        )}
        <p className='text-sm'>
          Acesse os planos para continuar utilizando todos os recursos.
        </p>
      </div>

      <Link
        className='flex w-fit items-center justify-center rounded-lg bg-zinc-900 px-3 py-1 text-white hover:bg-zinc-800'
        href={'/dashboard/plans'}
      >
        Ver planos
      </Link>
    </div>
  )
}
