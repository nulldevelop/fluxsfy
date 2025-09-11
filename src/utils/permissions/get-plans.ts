'use server'

import type { Plan } from '@prisma/client'
import type { PlansProps } from '@/utils/plans/index'

export interface PlanDetailInfo {
  maxServices: number
}

const PLANS_LIMITS: PlansProps = {
  BASIC: {
    maxServices: 3,
  },
  PLUS: {
    maxServices: 15,
  },
  PROFESSIONAL: {
    maxServices: 50,
  },
}

export async function getPlan(planId: Plan) {
  return PLANS_LIMITS[planId]
}
