'use client'

import { Loader, LogIn, Menu } from 'lucide-react'
import Link from 'next/link'
import { useSession, loginWithGoogle } from '@/lib/auth-client'
import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '../../../components/ui/button'

export function Header() {
  const { data: session, isPending } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [{ href: '#professionals', label: 'Profissionais' }]

  async function handleLogin() {
    await loginWithGoogle()
  }

  // biome-ignore lint/nursery/noNestedComponentDefinitions: dev
  const NavLinks = () => (
    <>
      {navItems.map((item) => (
        <Button
          asChild
          className='bg-transparent text-white font-barlow font-bold shadow-none hover:bg-transparent'
          key={item.href}
          onClick={() => setIsOpen(false)}
        >
          <Link className='text-base' href={item.href}>
            {item.label}
          </Link>
        </Button>
      ))}

      {isPending ? (
        <Loader className='animate-spin text-white' />
      ) : session ? (
        <Button
          asChild
          variant="default"
          className="px-6"
        >
          <Link href="/dashboard">Dashboard</Link>
        </Button>
      ) : (
        <Button
          variant="default"
          className='px-6'
          onClick={handleLogin}
        >
          <LogIn />
          Acessar
        </Button>
      )}
    </>
  )

  return (
    <header className='fixed top-0 right-0 left-0 z-999'>
      <div className='polo-barber' />
      <div className='bg-black/90 h-20'>
        <div className='container relative z-10 mx-auto flex h-full items-center justify-between px-6'>
          <Link className='font-bebas text-2xl md:text-4xl text-cream tracking-widest flex flex-col leading-none' href='/'>
            LA ELE
            <span className='text-gold text-sm md:text-xl tracking-[0.22em] mt-0.5 md:mt-0'>Barbearia</span>
          </Link>

          <nav className='hidden items-center space-x-4 md:flex'>
            <NavLinks />
          </nav>

          <Sheet onOpenChange={setIsOpen} open={isOpen}>
            <SheetTrigger asChild className='md:hidden'>
              <Button
                className='text-white hover:bg-transparent'
                size='icon'
                variant='ghost'
              >
                <Menu className='h-6 w-6' />
              </Button>
            </SheetTrigger>

            <SheetContent
              className='z-9999 w-60 border-primary border-l bg-black text-white sm:w-75'
              side='right'
            >
              <SheetTitle className='text-gold font-bebas'>Menu</SheetTitle>
              <SheetHeader />
              <SheetDescription className='text-muted-foreground font-barlow'>
                Veja nossos links
              </SheetDescription>

              <nav className='mt-6 flex flex-col space-y-4'>
                <NavLinks />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
