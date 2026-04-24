'use client'

import { ptBR } from 'date-fns/locale/pt-BR'
import { useState } from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

registerLocale('pt-BR', ptBR)

interface DateTimePickerProps {
  minDate?: Date
  className?: string
  initialDate?: Date
  onChange: (date: Date) => void
}

export function DateTimePicker({
  className,
  minDate,
  initialDate,
  onChange,
}: DateTimePickerProps) {
  const [startDate, setStartDate] = useState(initialDate || new Date())

  function handleChange(date: Date | null) {
    if (date) {
      setStartDate(date)
      onChange(date)
    }
  }

  return (
    <DatePicker
      className={className}
      dateFormat='dd/MM/yyyy'
      locale='pt-BR'
      minDate={minDate ?? new Date()}
      onChange={handleChange}
      selected={startDate}
    />
  )
}
