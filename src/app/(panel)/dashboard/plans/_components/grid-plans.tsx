import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { subscriptionPlans } from '@/utils/plans/index'
import { SubscriptionButton } from './subscription-button'

export function GridPlans() {
  return (
    <section className='grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-3'>
      {subscriptionPlans.map((plan, index) => (
        <Card
          className={`mx-auto flex w-full flex-col justify-between ${index === 1 && 'border-emerald-500'}`}
          key={plan.id}
        >
          {index === 1 && (
            <div className='w-full rounded-t-xl bg-emerald-500 py-3 text-center'>
              <p className='font-semibold text-white'>MELHOR PLANO</p>
            </div>
          )}

          <CardHeader>
            <CardTitle className='text-xl md:text-2xl'>{plan.name}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
          </CardHeader>

          <CardContent>
            <ul>
              {plan.features.map((feature) => (
                <li className='text-sm md:text-base' key={feature}>
                  {feature}
                </li>
              ))}
            </ul>

            <div className='mt-4'>
              <p className='text-gray-600 line-through'>{plan.oldPrice}</p>
              <p className='font-bold text-2xl text-black'>{plan.price}</p>
            </div>
          </CardContent>
          <CardFooter>
            <SubscriptionButton
              type={
                plan.id === 'BASIC'
                  ? 'BASIC'
                  : plan.id === 'PLUS'
                    ? 'PLUS'
                    : 'PROFESSIONAL'
              }
            />
          </CardFooter>
        </Card>
      ))}
    </section>
  )
}
