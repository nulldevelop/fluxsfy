// Middleware simplificado para Better Auth

import { type NextRequest, NextResponse } from 'next/server'

export default function middleware(_request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/dashboard-owner/:path*'],
}
