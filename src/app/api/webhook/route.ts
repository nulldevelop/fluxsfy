import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { stripe } from '@/utils/stripe'

export const POST = async (request: Request) => {
  const signature = request.headers.get('stripe-signature') as string

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing Stripe signature' },
      { status: 400 }
    )
  }

  const text = await request.text()

  const event = stripe.webhooks.constructEvent(
    text,
    signature,
    process.env.STRIPE_SECRET_WEBHOOK_KEY as string
  )

  // biome-ignore lint/style/useDefaultSwitchClause: 
  switch (event.type) {
    case 'customer.subscription.deleted': {
      const payment = event.data.object as Stripe.Subscription
      break
    }
    case 'customer.subscription.updated': {
      const paymentIntent = event.data.object as Stripe.Subscription
      break
    }

    case 'checkout.session.completed': {
      const checkoutSession = event.data.object as Stripe.Checkout.Session
      break
    }

    default:
      console.warn(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true }, { status: 200 })
}
