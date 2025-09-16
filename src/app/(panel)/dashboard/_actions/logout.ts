'use server'

import { signOut } from '@/lib/auth'

export async function handleLogoutAction() {
  await signOut({ redirectTo: '/' })
}
