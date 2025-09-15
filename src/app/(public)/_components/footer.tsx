export function Footer() {
  return (
    <footer className='bg-zinc-900 py-6 text-center text-gray-500 text-sm md:text-base'>
      <p>
        Todos direitos reservados © {new Date().getFullYear()} -{' '}
        <span className='duration-300 hover:text-black'>@devPH</span>
      </p>
    </footer>
  )
}
