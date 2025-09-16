import { Star } from 'lucide-react'

interface RatingProps {
  value: number
}

export function Rating({ value }: RatingProps) {
  // Cria um array com 5 posições e pinta preenchido até o valor
  return (
    <div className='flex space-x-1'>
      {Array.from({ length: 5 }).map((_, i) => {
        const key = `star-value-${value}-pos-${i}`
        return (
          <Star
            className={i < value ? 'text-yellow-400' : 'text-gray-500'}
            key={key}
            size={16}
          />
        )
      })}
    </div>
  )
}
