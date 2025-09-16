import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import prisma from './prisma'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  providers: [Google],
  callbacks: {
    async session({ session, user }) {
      if (session.user && user) {
        // @ts-expect-error augment at types/next.auth.d.ts
        session.user.role = user.role
        // @ts-expect-error augment at types/next.auth.d.ts
        session.user.status = user.status
      }
      return session
    },
  },
})
