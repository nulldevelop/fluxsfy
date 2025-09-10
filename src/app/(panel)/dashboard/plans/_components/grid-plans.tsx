import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { subscriptionPlans } from '@/utils/plans'

export function GridPlans() {
  return (
    <div className='md-gap-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2'>
      {subscriptionPlans.map((plan, index) => (
        <Card
          className={`mx-auto flex h-auto w-full flex-col ${index === 1 && 'border-emerald-500'}`}
          key={plan.id}
        >
          {index === 1 && (
            <div className='mt-0 w-full rounded-t-xl bg-emerald-500 py-3 text-center'>
              <p className='font-semibold text-white'>MELHOR PLANO</p>
            </div>
          )}

          <CardHeader>
            <CardTitle className='text-xl md:text-2xl'>{plan.name}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className=''>
              {plan.features.map((feature) => (
                <li className='text-sm md:text-base' key={feature}>
                  • {feature}
                </li>
              ))}
            </ul>

            <div className='mt-4 space-x-2'>
              <p className='text-gray-600 line-through'>{plan.oldPrice}</p>
              <p className='font-bold text-2xl text-balck'>{plan.price}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button className='w-full bg-black'>Fazer Assinatura</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
