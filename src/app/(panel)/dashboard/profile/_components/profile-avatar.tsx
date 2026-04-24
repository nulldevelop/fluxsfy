'use client'
import { Loader, Upload } from 'lucide-react'
import Image from 'next/image'
import { type ChangeEvent, useState } from 'react'
import { toast } from 'sonner'
import { useSession } from '@/lib/auth-client'
import semFoto from '../../../../../../public/banner.png'
import { updateProfileAvatar } from '../_actions/update-avatar'

interface AvatarProfileProps {
  avatarUrl: string | null
  userId: string
}

export function AvatarProfile({ avatarUrl, userId }: AvatarProfileProps) {
  const [previewImage, setPreviewImage] = useState(avatarUrl)
  const [loading, setLoading] = useState(false)
  const { data: session } = useSession()

  async function handleChange(e: ChangeEvent<HTMLInputElement>) {
    // biome-ignore lint/complexity/useOptionalChain: Dev
    if (e.target.files && e.target.files[0]) {
      setLoading(true)
      const image = e.target.files[0]

      if (image.type !== 'image/jpeg' && image.type !== 'image/png') {
        toast.error('Formato de imagem inválido')
        return
      }

      const newFilename = `${userId}`
      const newFile = new File([image], newFilename, { type: image.type })

      const urlImage = await uploadImage(newFile)

      if (!urlImage || urlImage === '') {
        toast.error('Falha ao alterar imagem')
        return
      }

      setPreviewImage(urlImage)

      await updateProfileAvatar({ avatarUrl: urlImage })

      setLoading(false)
    }
  }

  async function uploadImage(image: File): Promise<string | null> {
    try {
      toast('Estamos enviando sua imagem...')

      const formData = new FormData()

      formData.append('file', image)
      formData.append('userId', userId)

      const response = await fetch('/api/image/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        return null
      }

      toast('Imagem alterada com sucesso!')
      return data.secure_url as string
    } catch {
      return null
    }
  }

  return (
    <div className='relative h-40 w-40 md:h-48 md:w-48'>
      <div className='relative flex h-full w-full items-center justify-center '>
        <span className='absolute z-[2] cursor-pointer rounded-full bg-slate-50/80 p-2 shadow-xl'>
          {loading ? (
            <Loader className='animate-spin' color='#131313' size={16} />
          ) : (
            <Upload color='#131313' size={16} />
          )}
        </span>

        <input
          accept='image/jpeg, image/png'
          className='relative z-50 h-48 w-48 cursor-pointer opacity-0'
          onChange={handleChange}
          type='file'
        />
      </div>

      {previewImage ? (
        <Image
          alt='Foto de perfil da barbearia'
          className='h-48 w-full rounded-full bg-slate-200 object-cover'
          fill
          priority
          quality={100}
          sizes='(max-width: 480px) 100vw, (max-width: 1024px) 75vw, 60vw'
          src={previewImage}
        />
      ) : (
        <Image
          alt='Foto de perfil da barbearia'
          className='h-48 w-full rounded-full bg-slate-200 object-cover'
          fill
          priority
          quality={100}
          sizes='(max-width: 480px) 100vw, (max-width: 1024px) 75vw, 60vw'
          src={semFoto}
        />
      )}
    </div>
  )
}
