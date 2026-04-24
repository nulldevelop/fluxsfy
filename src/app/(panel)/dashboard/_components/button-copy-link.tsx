'use client'

import { LinkIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

export function ButtonCopyLink({ userId, slug }: { userId: string, slug?: string | null }) {
  async function handleCopyLink() {
    const baseUrl = process.env.NEXT_PUBLIC_URL || window.location.origin
    const identifier = slug || userId
    await navigator.clipboard.writeText(
      `${baseUrl}/barbearia/${identifier}`
    )
    toast.success('Link copiado com sucesso!')
  }

  return (
    <Button className='' onClick={handleCopyLink}>
      <LinkIcon className='h-5 w-5' />
    </Button>
  )
}
