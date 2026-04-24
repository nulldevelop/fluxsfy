'use client'

import type React from 'react'

export function SessionAuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
