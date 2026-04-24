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
          className={`mx-auto flex w-full flex-col justify-between ${index === 1 && 'border-gold border-2'}`}
          key={plan.id}
        >
          {index === 1 && (
            <div className='w-full bg-gold py-3 text-center'>
              <p className='font-bebas text-lg tracking-widest text-black uppercase'>MELHOR PLANO</p>
            </div>
          )}

          <CardHeader>
            <CardTitle className='text-3xl'>{plan.name}</CardTitle>
            <CardDescription className="text-zinc-500 font-barlow font-bold uppercase tracking-widest text-xs">{plan.description}</CardDescription>
          </CardHeader>

          <CardContent>
            <ul className="space-y-2">
              {plan.features.map((feature) => (
                <li className='text-sm md:text-base text-cream flex items-center gap-2' key={feature}>
                  <div className="size-1.5 bg-gold" />
                  {feature}
                </li>
              ))}
            </ul>

            <div className='mt-6'>
              <p className='text-zinc-600 line-through text-xs font-bold uppercase tracking-widest'>{plan.oldPrice}</p>
              <p className='font-bebas text-5xl text-gold tracking-tight'>{plan.price}</p>
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
