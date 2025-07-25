'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { TimeSlot } from './schedule-content'
import {
  isSlotInThePast,
  isSlotSequenceAvailable,
  isToday,
} from './schedule-utils'

interface ScheduleTimeListProps {
  selectedDate: Date
  selectedTime: string
  requiredSlots: number
  blockedTimes: string[]
  availableTimeSlots: TimeSlot[]
  clinicTimes: string[]
  onSelectTime: (time: string) => void
}

export function ScheduleTimeList({
  selectedDate,
  availableTimeSlots,
  blockedTimes,
  clinicTimes,
  requiredSlots,
  selectedTime,
  onSelectTime,
}: ScheduleTimeListProps) {
  const dateIsToday = isToday(selectedDate)

  return (
    <div className='grid grid-cols-3 gap-2 md:grid-cols-5'>
      {availableTimeSlots.map((slot) => {
        const sequenceOK = isSlotSequenceAvailable(
          slot.time,
          requiredSlots,
          clinicTimes,
          blockedTimes
        )

        const slotIsPast = dateIsToday && isSlotInThePast(slot.time)

        const slotEnabled = slot.available && sequenceOK && !slotIsPast

        return (
          <Button
            className={cn(
              'h-10 select-none',
              selectedTime === slot.time &&
                'border-2 border-emerald-500 text-primary',
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
