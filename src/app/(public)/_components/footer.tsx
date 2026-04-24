export function Footer() {
  return (
    <footer className='bg-black py-10 text-center border-t border-primary/20'>
      <div className='polo-barber mx-auto w-32 mb-6' />
      <p className='font-bebas text-xl text-cream tracking-widest mb-2'>
        LA ELE <span className='text-gold'>BARBEARIA</span>
      </p>
      <p className='font-barlow text-zinc-600 text-[10px] uppercase tracking-[0.4em] font-bold'>
        Est. 2021 · Campina Grande do Sul · Todos direitos reservados © {new Date().getFullYear()}
      </p>
    </footer>
  )
}
