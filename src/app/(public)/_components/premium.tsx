import { Star } from 'lucide-react'

interface PremiumBadgeProps {
  plan: 'BASIC' | 'PLUS' | 'PRO'
}

export function PremiumBadge({ plan }: PremiumBadgeProps) {
  // biome-ignore lint/style/useBlockStatements: dev
  if (plan === 'BASIC') {
    return null
  }
  const bgColor =
    plan === 'PLUS'
      ? 'bg-gray-300'
      : plan === 'PRO'
        ? 'bg-yellow-500'
        : 'bg-yellow-300'

  return (
    <div>
      <span
        className={`absolute top-2 left-2 flex h-10 w-10 items-center justify-center rounded-full px-2 py-1 ${bgColor} text-xs`}
      >
        <Star />
      </span>
    </div>
  )
}
