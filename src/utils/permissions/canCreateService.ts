'use server'

import type { Subscription } from '@prisma/client'
import type { Session } from 'next-auth'
import prisma from '@/lib/prisma'
import { checkSubscriptionExpired } from '@/utils/permissions/checkSubscriptionExpired'
import { plans } from '../plans'
import type { ResultPermissionProp } from './canPermission'
import { getPlan } from './get-plans'

export async function canCreateService(
  subscription: Subscription | null,
  session: Session
): Promise<ResultPermissionProp> {
  try {
    const serviceCount = await prisma.service.count({
      where: {
        userId: session?.user?.id,
      },
    })

    if (subscription && subscription.status === 'active') {
      const plan = subscription.plan
      const planLimits = await getPlan(plan)

      return {
        hasPermission:
          planLimits.maxServices === null ||
          serviceCount <= planLimits.maxServices,
        planId: subscription.plan,
        expired: false,
        plan: plans[subscription.plan],
      }
    }

    const checkUserLimit = await checkSubscriptionExpired(session)

    return checkUserLimit
  } catch {
    return {
      hasPermission: false,
      planId: 'EXPIRED',
      expired: false,
      plan: null,
    }
  }
}
