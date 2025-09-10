export type PlanDetailsProps = {
  maxServices: number
}

export type PlansProps = {
  id: 'BASIC' | 'PROFESSIONAL'
}

export const plans = {
  BASIC: {
    maxServices: 3,
  },
  PROFESSIONAL: {
    maxServices: 50,
  },
}
export const subscriptionPlans = [
  {
    id: 'BASIC',
    name: 'Basic',
    price: '39,99',
    oldPrice: '89,99',
    features: [
      `Até ${plans.BASIC.maxServices} serviços ativos`,
      'Agendamentos ilimitados',
      'Suporte via e-mail',
      'Relatórios básicos',
    ],
    description: 'Perfeito para quem está começando',
    maxServices: plans.BASIC.maxServices,
  },
  {
    id: 'PROFESSIONAL',
    name: 'Professional',
    price: '89,99',
    oldPrice: '129,99',
    features: [
      `Até ${plans.PROFESSIONAL.maxServices} serviços ativos`,
      'Agendamentos ilimitados',
      'Suporte via e-mail e telefone',
      'Relatórios avançados',
    ],
    description: 'Perfeito para quem é profissional ou grandes negócios',
    maxServices: plans.PROFESSIONAL.maxServices,
  },
]
