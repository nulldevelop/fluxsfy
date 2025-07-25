'use client'

import { LinkIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

export function ButtonCopyLink({ userId }: { userId: string }) {
  async function handleCopyLink() {
    await navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_URL}/clinica/${userId}`
    )
    toast.success('Link copiado com sucesso!')
  }

  return (
    <Button className='' onClick={handleCopyLink}>
      <LinkIcon className='h-5 w-5' />
    </Button>
  )
}
