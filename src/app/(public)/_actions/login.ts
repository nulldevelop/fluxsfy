'use server'

import { signIn } from '@/lib/auth'
import { redirect } from 'next/navigation'

type LoginType = 'google'

export async function handleRegister(provider: LoginType) {
  const result = await signIn(provider, { redirectTo: '/dashboard' })
  
  if (result?.url) {
    redirect(result.url)
  }
}
