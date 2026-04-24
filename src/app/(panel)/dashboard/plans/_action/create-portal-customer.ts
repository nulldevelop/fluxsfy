'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/utils/stripe'

export async function createPortalCustomer() {
  const session = await auth()

  if (!session?.user?.id) {
    return {
      url: '',
      error: 'Falha ao acessar o portal de cobrança.',
    }
  }

  const user = await prisma.user.findFirst({
    where: { id: session.user.id },
  })

  if (!user) {
    return {
      url: '',
      error: 'Falha ao acessar o portal de cobrança.',
    }
  }

  const sessionId = user.stripe_customer_id

  if (!sessionId) {
    return {
      url: '',
      error: 'Falha ao acessar o portal de cobrança.',
    }
  }
  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: sessionId,
      return_url: process.env.STRIPE_SUCCESS_URL as string,
    })

    return { url: portalSession.url, error: '' }
  } catch {
    console.error('Error creating portal customer')
  }
}
