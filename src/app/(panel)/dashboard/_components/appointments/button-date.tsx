'use client'

import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import type React from 'react'
import { useState } from 'react'

export function ButtonDatePicker() {
  const router = useRouter()
  const [selectDate, setSelectDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  function handleChangeDate(event: React.ChangeEvent<HTMLInputElement>) {
    setSelectDate(event.target.value)
    const url = new URL(window.location.href)
    url.searchParams.set('date', event.target.value)
    router.push(url.toString())
  }
  return (
    <input
      className='rounded-md border-2 border-gray-300 px-2 py-1 text-sm md:text-base'
      id='start'
      onChange={handleChangeDate}
      type='date'
      value={selectDate}
    />
  )
}
