import type { Plan } from '@prisma/client'
import prisma from '@/lib/prisma'
import { stripe } from '@/utils/stripe'

/**
 * Salvar, Atualizar ou Deletar a assinatura do usuário no banco de dados
 */

export async function manageSubscription(
  subscriptionId: string,
  customerId: string,
  createAction = false,
  deleteAction = false,
  type?: Plan
) {
  const findUser = await prisma.user.findFirst({
    where: { stripe_customer_id: customerId },
  })

  if (!findUser) {
    return Response.json({ error: 'User not found' }, { status: 400 })
  }
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  const subscriptionData = {
    id: subscription.id,
    userId: findUser.id,
    status: subscription.status,
    priceId: subscription.items.data[0].price.id,
    plan: type ?? 'BASIC',
  }

  if (subscriptionId && deleteAction) {
    await prisma.subscription.deleteMany({
      where: { id: subscriptionId },
    })
    return
  }

  if (createAction) {
    try {
      await prisma.subscription.create({
        data: subscriptionData,
      })
    } catch {
      console.error('Error creating subscription in database')
    }
  } else {
    try {
      const findSubscription = await prisma.subscription.findFirst({
        where: { id: subscriptionId },
      })
      if (!findSubscription) {
        return
      }

      await prisma.subscription.update({
        where: { id: findSubscription.id },
        data: {
          status: subscription.status,
          priceId: subscription.items.data[0].price.id,
        },
      })
    } catch {
      console.error('Error updating subscription in database')
    }
    
  }
}
