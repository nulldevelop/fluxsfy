'use client'

import type { Prisma } from '@prisma/client'
import { MapPin } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatPhone } from '@/utils/formatPhone'
import { createNewAppointment } from '../_actions/create-appointment'
import { DateTimePicker } from './date-picker'
import { type AppointmentFormData, useAppointmentForm } from './schedule-form'
import { ScheduleTimeList } from './schedule-time-list'

type UserWithServiceAndSubscription = Prisma.UserGetPayload<{
  include: {
    subscription: true
    services: true
  }
}>

interface ScheduleContentProps {
  clinic: UserWithServiceAndSubscription
}

export interface TimeSlot {
  time: string
  available: boolean
}

export function ScheduleContent({ clinic }: ScheduleContentProps) {
  const form = useAppointmentForm()
  const { watch } = form
  const router = useRouter()

  const selectedDate = watch('date')
  const selectedServiceId = watch('serviceId')

  const [selectedTime, setSelectedTime] = useState('')
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  // Quais os horários bloqueados 01/02/2025 > ["15:00", "18:00"]
  const [blockedTimes, setBlockedTimes] = useState<string[]>([])

  const fetchBlockedTimes = useCallback(
    async (date: Date): Promise<string[]> => {
      setLoadingSlots(true)
      try {
        const dateString = date.toISOString().split('T')[0]
        const response = await fetch(
          `/api/schedule/get-appointments?userId=${clinic.id}&date=${dateString}`
        )

        const json = await response.json()
        setLoadingSlots(false)
        return json
      } catch {
        setLoadingSlots(false)
        return []
      }
    },
    [clinic.id]
  )

  useEffect(() => {
    if (selectedDate) {
      fetchBlockedTimes(selectedDate).then((blocked) => {
        setBlockedTimes(blocked)

        const times = clinic.times || []

        const finalSlots = times.map((time) => ({
          time,
          available: !blocked.includes(time),
        }))

        setAvailableTimeSlots(finalSlots)

        // Se o slot atual estiver indisponivel, limpamos a seleção
        const stillAvailable = finalSlots.find(
          (slot) => slot.time === selectedTime && slot.available
        )

        if (!stillAvailable) {
          setSelectedTime('')
        }
      })
    }
  }, [selectedDate, clinic.times, fetchBlockedTimes, selectedTime])

  async function handleRegisterAppointmnent(formData: AppointmentFormData) {
    if (!selectedTime) {
      return
    }

    const response = await createNewAppointment({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      time: selectedTime,
      date: formData.date,
      serviceId: formData.serviceId,
      clinicId: clinic.id,
    })

    if (response.error) {
      toast.error(response.error)
      return
    }

    toast.success('Consulta agendada com sucesso!')
    if (response.data?.id) {
      // Redireciona para página de confirmação (com comprovante)
      router.push(`/agendamento/${response.data.id}`)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 text-white'>
      {/* Banner com overlay */}
      <div className='relative h-40 w-full overflow-hidden md:h-56'>
        <Image
          alt='Banner'
          className='object-cover'
          fill
          priority
          src='/banner.png'
        />
        <div className='absolute inset-0 bg-black/50' />
      </div>

      {/* Glow decorativo */}
      <div className='pointer-events-none mx-auto max-w-6xl px-4 [background:radial-gradient(900px_400px_at_50%_-50%,rgba(16,185,129,0.15),transparent_60%)]' />

      <section className='container relative z-10 mx-auto w-full max-w-6xl px-4 py-10'>
        <div className='grid grid-cols-1 items-center gap-8 md:grid-cols-2'>
          {/* Coluna esquerda: foto e detalhes */}
          <article className='flex flex-col items-center text-center'>
            <div className='relative mb-6 h-48 w-48 overflow-hidden rounded-full border-4 border-white'>
              <Image
                alt='Foto da clinica'
                className='object-cover'
                fill
                src={clinic.image ? clinic.image : '/medic2.png'}
              />
            </div>

            <h1 className='mb-2 font-bold text-2xl'>{clinic.name}</h1>
            <div className='mb-1 flex items-center gap-1'>
              <MapPin className='h-5 w-5 text-white' />
              <span>
                {clinic.address ? clinic.address : 'Endereço não informado'}
              </span>
            </div>
            <div className='text-gray-300'>
              {clinic.phone && clinic.phone.length > 0
                ? clinic.phone
                : 'Telefone não informado'}
            </div>
          </article>

          {/* Coluna direita: formulário */}
          <div className='w-full'>
            <Form {...form}>
              <form
                className='space-y-6 rounded-xl border border-zinc-800 bg-white/10 p-6 shadow-2xl backdrop-blur'
                onSubmit={form.handleSubmit(handleRegisterAppointmnent)}
              >
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem className='my-2'>
                      <FormLabel className='font-semibold text-white'>
                        Nome completo:
                      </FormLabel>
                      <FormControl>
                        <Input
                          id='name'
                          placeholder='Digite seu nome completo...'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem className='my-2'>
                      <FormLabel className='font-semibold text-white'>
                        Email:
                      </FormLabel>
                      <FormControl>
                        <Input
                          id='email'
                          placeholder='Digite seu email...'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='phone'
                  render={({ field }) => (
                    <FormItem className='my-2'>
                      <FormLabel className='font-semibold text-white'>
                        Telefone:
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          id='phone'
                          onChange={(e) => {
                            const formattedValue = formatPhone(e.target.value)
                            field.onChange(formattedValue)
                          }}
                          placeholder='(XX) XXXXX-XXXX'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='date'
                  render={({ field }) => (
                    <FormItem className='flex items-center gap-2 space-y-1'>
                      <FormLabel className='font-semibold text-white'>
                        Data do agendamento:
                      </FormLabel>
                      <FormControl>
                        <DateTimePicker
                          className='w-full rounded border p-2 '
                          inicitalDate={new Date()}
                          onChange={(date) => {
                            if (date) {
                              field.onChange(date)
                              setSelectedTime('')
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='serviceId'
                  render={({ field }) => (
                    <FormItem className=''>
                      <FormLabel className='font-semibold text-white'>
                        Selecione o serviço:
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value)
                            setSelectedTime('')
                          }}
                        >
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Selecione um serviço' />
                          </SelectTrigger>
                          <SelectContent>
                            {clinic.services.map((service) => (
                              <SelectItem key={service.id} value={service.id}>
                                {service.name} -{' '}
                                {Math.floor(service.duration / 60)}h{' '}
                                {service.duration % 60}min
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedServiceId && (
                  <div className='space-y-2'>
                    <Label className='font-semibold text-white'>
                      Horários disponíveis:
                    </Label>
                    <div className='rounded-lg bg-gray-100 p-4 text-black'>
                      {loadingSlots ? (
                        <p>Carregando horários...</p>
                      ) : availableTimeSlots.length === 0 ? (
                        <p>Nenhum horário disponível</p>
                      ) : (
                        <ScheduleTimeList
                          availableTimeSlots={availableTimeSlots}
                          blockedTimes={blockedTimes}
                          clinicTimes={clinic.times}
                          onSelectTime={(time) => setSelectedTime(time)}
                          requiredSlots={
                            clinic.services.find(
                              (service) => service.id === selectedServiceId
                            )
                              ? Math.ceil(
                                  clinic.services.find(
                                    (service) =>
                                      service.id === selectedServiceId
                                  )!.duration / 30
                                )
                              : 1
                          }
                          selectedDate={selectedDate}
                          selectedTime={selectedTime}
                        />
                      )}
                    </div>
                  </div>
                )}

                {clinic.status ? (
                  <Button
                    className='w-full bg-emerald-500 hover:bg-emerald-400'
                    disabled={
                      !(
                        watch('name') &&
                        watch('email') &&
                        watch('phone') &&
                        watch('date')
                      )
                    }
                    type='submit'
                  >
                    Realizar agendamento
                  </Button>
                ) : (
                  <p className='rounded-md bg-red-500 px-4 py-2 text-center text-white'>
                    A clinica está fechada nesse momento.
                  </p>
                )}
              </form>
            </Form>
          </div>
        </div>
      </section>
    </div>
  )
}
