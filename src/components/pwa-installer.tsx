'use client'

import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export function PwaInstaller() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  function handleInstall() {
    alert(
      'Para instalar no iPhone:\n\n1. Toque no botão Compartilhar (+) abaixo\n2. Role até "Adicionar à Tela de Início"\n3. Toque em "Adicionar"'
    )
    setOpen(false)
  }

  async function shareApp() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Fluxsfy',
          text: 'Acesse minha agenda',
          url: window.location.href,
        })
      }
    } catch (e) {
      // User cancelled or not supported
    }
    setOpen(false)
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent className='max-w-[20rem] border-zinc-700 bg-zinc-900'>
        <DialogHeader className='items-center'>
          <div className='flex h-16 w-16 items-center justify-center rounded-full bg-amber-500 text-3xl'>
            📱
          </div>
          <DialogTitle className='text-white'>Instalar App</DialogTitle>
          <DialogDescription className='text-zinc-400'>
            Tenha o Fluxsfy sempre disponível no seu celular!
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-2'>
          <Button
            className='bg-amber-500 text-black hover:bg-amber-600'
            onClick={handleInstall}
          >
            Instalar Agora
          </Button>
          <Button
            className='border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100'
            onClick={shareApp}
            variant='outline'
          >
            Compartilhar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
