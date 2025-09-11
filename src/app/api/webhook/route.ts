import type { Plan } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { manageSubscription } from '@/utils/manage-subscription'
import { stripe } from '@/utils/stripe'

export const POST = async (request: Request) => {
  const signature = request.headers.get('stripe-signature') as string

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing Stripe signature' },
      { status: 400 }
    )
  }
  console.assert('WEBHOOK RECEBIDO')

  const text = await request.text()

  const event = stripe.webhooks.constructEvent(
    text,
    signature,
    process.env.STRIPE_SECRET_WEBHOOK_KEY as string
  )

  switch (event.type) {
    case 'customer.subscription.deleted': {
      const payment = event.data.object as Stripe.Subscription
      await manageSubscription(
        payment.id,
        payment.customer.toString(),
        false,
        true
      )
      break
    }
    case 'customer.subscription.updated': {
      const paymentIntent = event.data.object as Stripe.Subscription
      await manageSubscription(
        paymentIntent.id,
        paymentIntent.customer.toString(),
        false
      )
      break
    }

    case 'checkout.session.completed': {
      const checkoutSession = event.data.object as Stripe.Checkout.Session
      const type = checkoutSession.metadata?.type
        ? checkoutSession.metadata?.type
        : 'BASIC'
      if (checkoutSession.subscription && checkoutSession.customer) {
        await manageSubscription(
          checkoutSession.subscription.toString(),
          checkoutSession.customer.toString(),
          true,
          false,
          type as Plan
        )
      }
      revalidatePath('/dashboard/plans')
      break
    }

    default:
      console.warn(`Unhandled event type: ${event.type}`)
  }
  revalidatePath('/dashboard/plans')
  return NextResponse.json({ received: true }, { status: 200 })
}
