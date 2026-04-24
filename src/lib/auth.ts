import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { headers } from 'next/headers'
import { prisma } from './prisma'

export const betterAuthInstance = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'mysql',
  }),
  baseURL:
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_URL ||
    'http://localhost:3000',
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || process.env.AUTH_GOOGLE_ID!,
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET || process.env.AUTH_GOOGLE_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || process.env.AUTH_GITHUB_ID!,
      clientSecret:
        process.env.GITHUB_CLIENT_SECRET || process.env.AUTH_GITHUB_SECRET!,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  user: {
    additionalFields: {
      role: { type: 'string', defaultValue: 'USER' },
      status: { type: 'boolean', defaultValue: false },
      address: { type: 'string' },
      phone: { type: 'string' },
      timeZone: { type: 'string' },
      stripe_customer_id: { type: 'string' },
      times: { type: 'string' },
      rating: { type: 'number' },
      latitude: { type: 'number' },
      longitude: { type: 'number' },
    },
  },
})

// Helper para obter sessão no Servidor
export const auth = async () => {
  return await betterAuthInstance.api.getSession({
    headers: await headers(),
  })
}

export const signIn = async (
  provider: 'google' | 'github',
  options?: { redirectTo?: string }
) => {
  return await betterAuthInstance.api.signInSocial({
    body: {
      provider,
      callbackURL: options?.redirectTo || '/dashboard',
    },
    headers: await headers(),
  })
}

export const signOut = async () => {
  return await betterAuthInstance.api.signOut({
    headers: await headers(),
  })
}
