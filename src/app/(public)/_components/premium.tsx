import { Star } from 'lucide-react'

export function Premiunbadge() {
  return (
    <div>
      <span className='absolute top-2 left-2 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-300 px-2 py-1 text-xs'>
        <Star className='text-black' />
      </span>
    </div>
  )
}
