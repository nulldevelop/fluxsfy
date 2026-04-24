'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { TimeSlot } from './schedule-content'
import { isSlotInThePast, isToday } from './schedule-utils'

interface ScheduleTimeListProps {
  selectedDate: Date
  availableTimeSlots: TimeSlot[]
  clinicOpen: boolean
  onSelectTime: (time: string) => void
}

export function ScheduleTimeList({
  selectedDate,
  availableTimeSlots,
  clinicOpen,
  onSelectTime,
}: ScheduleTimeListProps) {
  const dateIsToday = isToday(selectedDate)

  return (
    <div className='grid grid-cols-3 gap-2 md:grid-cols-5'>
      {availableTimeSlots.map((slot) => {
        const slotIsPast = dateIsToday && isSlotInThePast(slot.time)
        const slotEnabled = slot.available && !slotIsPast && clinicOpen

        return (
          <Button
            className={cn(
              'h-10 select-none border-black',
              !slotEnabled && 'cursor-not-allowed opacity-50'
            )}
            disabled={!slotEnabled}
            key={slot.time}
            onClick={() => slotEnabled && onSelectTime(slot.time)}
            type='button'
            variant='outline'
          >
            {slot.time}
          </Button>
        )
      })}
    </div>
  )
}
