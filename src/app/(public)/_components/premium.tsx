import { Star } from 'lucide-react'

interface PremiumBadgeProps {
  plan: 'BASIC' | 'PLUS' | 'PRO'
}

export function PremiumBadge({ plan }: PremiumBadgeProps) {
  if (plan === 'BASIC') {
    return null
  }

  return (
    <div className="absolute top-4 left-4 z-20">
      <span className="badge-clipped bg-gold text-black shadow-lg">
        {plan === 'PRO' ? 'PREMIUM' : 'PLUS'}
      </span>
    </div>
  )
}
