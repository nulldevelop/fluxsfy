'use client'

import type { Plan } from '@prisma/client'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { getStripeJs } from '@/utils/stripe-js'
import { createSubscription } from '../_action/create-subscription'

interface SubscriptionButtonProps {
  type: Plan
}

export function SubscriptionButton({ type }: SubscriptionButtonProps) {
  async function handleCreateBilling() {
    const { sessionId, error } = await createSubscription({ type })

    if (error) {
      toast.error(error)
      return
    }

    const stripe = await getStripeJs()

    if (stripe) {
      await stripe.redirectToCheckout({ sessionId })
    }
  }

  return (
    <Button
      className={`w-full ${type === 'PLUS' && 'bg-emerald-500 hover:bg-emerald-400'}`}
      onClick={handleCreateBilling}
    >
      Ativar assinatura
    </Button>
  )
}
