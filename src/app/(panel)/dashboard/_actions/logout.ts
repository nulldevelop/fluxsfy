'use server'

import { headers } from 'next/headers'
import { auth } from '@/lib/auth'

export async function handleLogoutAction() {
  await auth.api.signOut({
    headers: await headers(),
  })
}
