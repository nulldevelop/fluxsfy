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

type UserWithServiceAndSubscriptionAndStaff = Prisma.UserGetPayload<{
  include: {
    subscription: true
    service: true
    staff: {
      include: {
        service: true
      }
    }
  }
}>

interface ScheduleContentProps {
  clinic: UserWithServiceAndSubscriptionAndStaff
}

export interface TimeSlot {
  time: string
  available: boolean
}

export function ScheduleContent({ clinic }: ScheduleContentProps) {
  const form = useAppointmentForm()
  const { watch, setValue } = form
  const router = useRouter()

  const selectedDate = watch('date')
  const selectedServiceId = watch('serviceId')
  const selectedStaffId = watch('staffId')

  const [selectedTime, setSelectedTime] = useState('')
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  // Filter staff based on selected service
  const filteredStaff = clinic.staff.filter((s) =>
    s.service.some((service) => service.id === selectedServiceId)
  )

  const [blockedTimes, setBlockedTimes] = useState<string[]>([])

  const fetchBlockedTimes = useCallback(
    async (date: Date, staffId: string): Promise<string[]> => {
      setLoadingSlots(true)
      try {
        const dateString = date.toISOString().split('T')[0]
        const response = await fetch(
          `/api/schedule/get-appointments?staffId=${staffId}&date=${dateString}`
        )

        const json = await response.json()
        setLoadingSlots(false)
        return json
      } catch {
        setLoadingSlots(false)
        return []
      }
    },
    []
  )

  useEffect(() => {
    if (selectedDate && selectedStaffId) {
      fetchBlockedTimes(selectedDate, selectedStaffId).then((blocked) => {
        setBlockedTimes(blocked)

        const staffMember = clinic.staff.find(s => s.id === selectedStaffId)
        const times = (staffMember?.times as string[]) || []

        const finalSlots = times.map((time) => ({
          time,
          available: !blocked.includes(time),
        }))

        setAvailableTimeSlots(finalSlots)

        const stillAvailable = finalSlots.find(
          (slot) => slot.time === selectedTime && slot.available
        )

        if (!stillAvailable) {
          setSelectedTime('')
        }
      })
    } else {
      setAvailableTimeSlots([])
      setBlockedTimes([])
    }
  }, [selectedDate, selectedStaffId, clinic.staff, fetchBlockedTimes, selectedTime])

  async function handleRegisterAppointmnent(formData: AppointmentFormData) {
    if (!selectedTime) {
      toast.error('Selecione um horário')
      return
    }

    const response = await createNewAppointment({
      ...formData,
      time: selectedTime,
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
    <div className='min-h-screen bg-off-white text-black'>
      {/* Polo Barber Top */}
      <div className='fixed top-0 left-0 right-0 z-50'>
        <div className='polo-barber' />
      </div>

      {/* Banner com overlay */}
      <div className='relative h-48 w-full overflow-hidden md:h-64'>
        <Image
          alt='Banner'
          className='object-cover grayscale brightness-50'
          fill
          priority
          src='/banner.png'
        />
        <div className='absolute inset-0 bg-black/40' />
        <div className='absolute inset-0 flex items-center justify-center px-4'>
            <h1 className='font-bebas text-4xl md:text-7xl text-cream tracking-[0.2em] text-center'>AGENDAMENTO</h1>
        </div>
      </div>

      <section className='container relative z-10 mx-auto w-full max-w-6xl px-4 py-6 md:py-10'>
        <div className='grid grid-cols-1 items-start gap-8 md:gap-12 md:grid-cols-2'>
          {/* Coluna esquerda: foto e detalhes */}
          <article className='flex flex-col items-center text-center bg-black p-6 md:p-8 border-l-4 md:border-l-8 border-gold'>
            <div className='relative mb-4 md:mb-6 h-48 w-48 md:h-64 md:w-64 overflow-hidden border-2 md:border-4 border-gold'>
              <Image
                alt='Foto da barbearia'
                className='object-cover grayscale'
                fill
                src={clinic.image ? clinic.image : '/medic2.png'}
              />
            </div>

            <h1 className='mb-2 font-bebas text-3xl md:text-5xl text-cream tracking-widest leading-none'>
                {clinic.name}
                <span className='block text-gold text-lg md:text-2xl tracking-[0.22em] mt-1 md:mt-2'>Barbearia</span>
            </h1>
            <div className='polo-barber w-24 md:w-32 my-4 md:my-6 mx-auto' />
            
            <div className='space-y-3 md:space-y-4'>
                <div className='flex items-center justify-center gap-2'>
                  <MapPin className='h-4 w-4 md:h-5 md:w-5 text-gold' />
                  <span className='font-barlow text-xs md:text-sm text-gray-400 uppercase tracking-widest font-bold'>
                    {clinic.address ? clinic.address : 'Endereço não informado'}
                  </span>
                </div>
                <div className='font-barlow text-cream uppercase tracking-[0.2em] md:tracking-[0.3em] text-base md:text-lg'>
                  {clinic.phone && clinic.phone.length > 0
                    ? clinic.phone
                    : 'Telefone não informado'}
                </div>
            </div>
          </article>

          {/* Coluna direita: formulário */}
          <div className='w-full'>
            <Form {...form}>
              <form
                className='space-y-4 md:space-y-6 bg-black p-6 md:p-10 border-l-4 border-gold shadow-2xl'
                onSubmit={form.handleSubmit(handleRegisterAppointmnent)}
              >
                <div className='label !text-gold !mb-4 md:!mb-6'>01 — Seus Dados</div>
                
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='font-bebas text-lg tracking-widest text-gold'>
                        Nome completo:
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="bg-zinc-900 border-zinc-800 text-cream placeholder:text-zinc-600"
                          id='name'
                          placeholder='Digite seu nome completo...'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className='font-bebas text-lg tracking-widest text-gold'>
                            Email:
                        </FormLabel>
                        <FormControl>
                            <Input
                            className="bg-zinc-900 border-zinc-800 text-cream placeholder:text-zinc-600"
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
                        <FormItem>
                        <FormLabel className='font-bebas text-lg tracking-widest text-gold'>
                            Telefone:
                        </FormLabel>
                        <FormControl>
                            <Input
                            className="bg-zinc-900 border-zinc-800 text-cream placeholder:text-zinc-600"
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
                </div>

                <div className='label !color-gold !mb-6 !mt-10'>02 — Horário e Serviço</div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                    control={form.control}
                    name='date'
                    render={({ field }) => (
                        <FormItem className='flex flex-col gap-2'>
                        <FormLabel className='font-bebas text-lg tracking-widest text-gold'>
                            Data do agendamento:
                        </FormLabel>
                        <FormControl>
                            <DateTimePicker
                            className='w-full rounded-none border-b-2 border-gold bg-zinc-900 p-2 text-cream'
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
                        <FormItem>
                        <FormLabel className='font-bebas text-lg tracking-widest text-gold'>
                            Selecione o serviço:
                        </FormLabel>
                        <FormControl>
                            <Select
                            onValueChange={(value) => {
                                field.onChange(value)
                                setSelectedTime('')
                            }}
                            >
                            <SelectTrigger className='w-full bg-zinc-900 border-zinc-800 text-cream'>
                                <SelectValue placeholder='Selecione um serviço' />
                            </SelectTrigger>
                            <SelectContent className="bg-black border-gold text-cream">
                                {clinic.service.map((service) => (
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
                </div>

                {selectedServiceId && (
                  <div className='space-y-2 mt-6'>
                    <Label className='font-bebas text-lg tracking-widest text-gold'>
                      Horários disponíveis:
                    </Label>
                    <div className='bg-zinc-900 p-6 border border-zinc-800'>
                      {loadingSlots ? (
                        <p className="font-barlow text-gold tracking-widest uppercase">Carregando horários...</p>
                      ) : availableTimeSlots.length === 0 ? (
                        <p className="font-barlow text-gray-500 tracking-widest uppercase">Nenhum horário disponível</p>
                      ) : (
                        <ScheduleTimeList
                          availableTimeSlots={availableTimeSlots}
                          blockedTimes={blockedTimes}
                          clinicTimes={clinic.times}
                          onSelectTime={(time) => setSelectedTime(time)}
                          requiredSlots={
                            clinic.service.find(
                              (service) => service.id === selectedServiceId
                            )
                              ? Math.ceil(
                                  clinic.service.find(
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
                    variant="default"
                    className='w-full mt-8'
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
                    Confirmar Agendamento
                  </Button>
                ) : (
                  <p className='font-barlow font-bold tracking-widest uppercase bg-barber-red px-4 py-3 text-center text-white mt-8'>
                    A barbearia está fechada nesse momento.
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
