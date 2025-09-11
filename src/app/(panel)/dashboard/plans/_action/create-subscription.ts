'use server'

import type { Plan } from '@prisma/client'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { stripe } from '@/utils/stripe'

interface SubscriptionProps {
  type: Plan
}

export async function createSubscription({ type }: SubscriptionProps) {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return {
      sessionId: '',
      error: 'Falha ao ativar plano.',
    }
  }

  const findUser = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  })

  if (!findUser) {
    return {
      sessionId: '',
      error: 'Falha ao ativar plano.',
    }
  }

  let customerId = findUser.stripe_customer_id

  if (!customerId) {
    // Caso o user não tenha um stripe_customer_id então criamos ele como cliente
    const stripeCustomer = await stripe.customers.create({
      email: findUser.email,
    })

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        stripe_customer_id: stripeCustomer.id,
      },
    })

    customerId = stripeCustomer.id
  }
  const price =
    type === 'BASIC'
      ? process.env.STRIPE_PRICE_ID_BASIC
      : type === 'PLUS'
        ? process.env.STRIPE_PRICE_ID_PLUS
        : process.env.STRIPE_PRICE_ID_PROFESSIONAL

  // CRIAR O CHECKOUT
  try {
    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      line_items: [
        {
          price,
          quantity: 1,
        },
      ],
      metadata: {
        type,
      },
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
    })

    return {
      sessionId: stripeCheckoutSession.id,
    }
  } catch {
    return {
      sessionId: '',
      error: 'Falha ao ativar plano.',
    }
  }
}
