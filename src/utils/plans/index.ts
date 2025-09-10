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
  PLUS: {
    maxServices: 15,
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
    id: 'PLUS',
    name: 'Plus',
    price: '89,90',
    oldPrice: '129,90',
    features: [
      `Até ${plans.PLUS.maxServices} serviços ativos`,
      'Agendamentos ilimitados',
      'Suporte via e-mail',
      'Relatórios básicos',
    ],
    description: 'Perfeito para quem já possui um negócio',
    maxServices: plans.PLUS.maxServices,
  },
  {
    id: 'PROFESSIONAL',
    name: 'Professional',
    price: '129,90',
    oldPrice: '189,90',
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
