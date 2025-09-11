'use client'

import type { Subscription } from '@prisma/client'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { subscriptionPlans } from '@/utils/plans/index'
import { createPortalCustomer } from '../_action/create-portal-customer'

interface SubscriptionDetailProps {
  subscription: Subscription
}

export function SubscriptionDetail({ subscription }: SubscriptionDetailProps) {

  const plan = subscriptionPlans.find((p) => p.id === subscription.plan)

  async function handleMenageSubscription() {
    const portal = await createPortalCustomer()
    if (!portal) {
      toast.error('Erro ao acessar o portal de cobrança.')
      return
    }
    window.location.href = portal.url
  }

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-center text-xl md:text-2xl'>
          Seu Plano está ativo!
        </CardTitle>
        <CardDescription>Você já possui uma assinatura ativa</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
          <h3 className='font-semibold text-lg md:text-xl'>
            {subscription.plan === 'BASIC'
              ? 'Plano Basic'
              : subscription.plan === 'PLUS'
                ? 'Plano Plus'
                : 'Plano Professional'}
          </h3>

          <div>
            {subscription.status === 'active' ? (
              <p className='w-fit rounded-lg bg-green-600 px-4 py-1 font-medium text-white'>
                Ativa
              </p>
            ) : (
              <p className='w-fit rounded-lg bg-red-600 px-4 py-1 font-medium text-white'>
                Inativa
              </p>
            )}
          </div>
        </div>

        <ul className='mt-4 list-inside list-disc space-y-1'>
          {plan?.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button className='pointer' onClick={handleMenageSubscription}>Gerenciar assinatura</Button>
      </CardFooter>
    </Card>
  )
}
