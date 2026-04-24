'use server'

import { addDays, differenceInDays, isAfter } from 'date-fns'
import { prisma } from '@/lib/prisma'
import { TRIAL_DAYS } from './trial-limits'

export async function checkSubscription(userId: string) {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    include: {
      subscription: true,
    },
  })

  if (!user) {
    return {
      subscriptionStatus: 'NONE',
      message: 'Nenhuma assinatura encontrada',
      planId: '',
    }
  }

  if (user.subscription && user.subscription.status === 'active') {
    return {
      subscriptionStatus: 'ACTIVE',
      message: 'Voce ja tem uma assinatura ativa',
      planId: user.subscription.plan,
    }
  }

  const trialEndDate = addDays(user?.createdAt!, TRIAL_DAYS)

  if (isAfter(new Date(), trialEndDate)) {
    return {
      subscriptionStatus: 'EXPIRED',
      message: 'Seu periodo de trial esta expirado',
      planId: 'TRIAL',
    }
  }

  const daysRemaining = differenceInDays(trialEndDate, new Date())

  return {
    subscriptionStatus: 'TRIAL',
    message: ` Voce tem ${daysRemaining} dias de teste gratis!`,
    planId: 'TRIAL',
  }
}
