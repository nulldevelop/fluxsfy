import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { prisma } from './prisma'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'mysql',
  }),
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
      slug: { type: 'string' },
    },
  },
})
