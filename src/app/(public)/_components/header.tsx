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
          className='bg-transparent text-white shadow-none hover:bg-transparent'
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
          className='flex items-center justify-center gap-2 rounded-md bg-gray-500 px-4 py-1 text-white'
        >
          <Link href="/dashboard">Sou Profissional</Link>
        </Button>
      ) : (
        <Button
          className='bg-emerald-500 px-4 text-white hover:bg-emerald-400'
          onClick={handleLogin}
        >
          <LogIn />
          Acessar Dashboard
        </Button>
      )}
    </>
  )

  return (
    <header className='fixed top-0 right-0 left-0 z-999 h-20'>
      {/* Overlay */}
      <div className='absolute inset-0 bg-black/40' />

      {/* Conteúdo */}
      <div className='container relative z-10 mx-auto flex h-full items-center justify-between px-6'>
        <Link className='font-bold text-3xl text-white' href='/'>
          Fluxs<span className='text-emerald-500'>Fy</span>
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
            className='z-9999 w-60 border-zinc-800 border-l bg-zinc-900 text-white sm:w-75'
            side='right'
          >
            <SheetTitle className='text-white'>Menu</SheetTitle>
            <SheetHeader />
            <SheetDescription className='text-gray-400'>
              Veja nossos links
            </SheetDescription>

            <nav className='mt-6 flex flex-col space-y-4'>
              <NavLinks />
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
