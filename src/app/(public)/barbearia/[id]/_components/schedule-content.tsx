'use client'

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
import { Toaster } from '@/components/ui/sonner'
import { formatPhone } from '@/utils/formatPhone'
import { createNewAppointment } from '../_actions/create-appointment'
import { DateTimePicker } from './date-picker'
import { type AppointmentFormData, useAppointmentForm } from './schedule-form'
import { ScheduleTimeList } from './schedule-time-list'

interface StaffMember {
  id: string
  name: string
  times: string[]
  services: Array<{ id: string; name: string; duration: number }>
}

interface ClinicData {
  id: string
  name: string
  image: string | null
  address: string | null
  phone: string | null
  status: boolean
  times: string[]
  services: Array<{ id: string; name: string; duration: number }>
  staff: StaffMember[]
}

interface ScheduleContentProps {
  clinic: ClinicData
}

export interface TimeSlot {
  time: string
  available: boolean
}

function toLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day, 12, 0, 0)
}

export function ScheduleContent({ clinic }: ScheduleContentProps) {
  const form = useAppointmentForm()
  const { watch } = form
  const router = useRouter()

  const selectedDate = watch('date')
  const selectedServiceId = watch('serviceId')
  const selectedStaffId = watch('staffId')

  const [selectedTime, setSelectedTime] = useState('')
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  const staffForSelectedService = clinic.staff.filter((s) =>
    s.services.some((service) => service.id === selectedServiceId)
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
      const dateObj = new Date(selectedDate)
      fetchBlockedTimes(dateObj, selectedStaffId).then((blocked) => {
        setBlockedTimes(blocked)

        const staffMember = clinic.staff.find((s) => s.id === selectedStaffId)
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
  }, [
    selectedDate,
    selectedStaffId,
    clinic.staff,
    fetchBlockedTimes,
    selectedTime,
  ])

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
    <div className='dark min-h-screen bg-background font-barlow text-foreground'>
      <Toaster duration={2500} richColors theme='dark' />
      {/* Polo Barber Top */}
      <div className='fixed top-0 right-0 left-0 z-50'>
        <div className='polo-barber' />
      </div>

      {/* Banner com overlay */}
      <div className='relative h-48 w-full overflow-hidden md:h-64'>
        <Image
          alt='Banner'
          className='object-cover brightness-50 grayscale'
          fill
          priority
          src='/banner.png'
        />
        <div className='absolute inset-0 bg-black/40' />
        <div className='absolute inset-0 flex items-center justify-center px-4'>
          <h1 className='text-center font-bebas text-4xl text-cream tracking-[0.2em] md:text-7xl'>
            AGENDAMENTO
          </h1>
        </div>
      </div>

      <section className='container relative z-10 mx-auto w-full max-w-6xl px-4 py-6 md:py-10'>
        <div className='grid grid-cols-1 items-start gap-8 md:grid-cols-2 md:gap-12'>
          {/* Coluna esquerda: foto e detalhes */}
          <article className='flex flex-col items-center border-gold border-l-4 bg-black p-6 text-center md:border-l-8 md:p-8'>
            <div className='relative mb-4 h-48 w-48 overflow-hidden border-2 border-gold md:mb-6 md:h-64 md:w-64 md:border-4'>
              <Image
                alt='Foto da barbearia'
                className='object-cover grayscale'
                fill
                src={clinic.image ? clinic.image : '/medic2.png'}
              />
            </div>

            <h1 className='mb-2 font-bebas text-3xl text-cream leading-none tracking-widest md:text-5xl'>
              {clinic.name}
              <span className='mt-1 block text-gold text-lg tracking-[0.22em] md:mt-2 md:text-2xl'>
                Barbearia
              </span>
            </h1>
            <div className='polo-barber mx-auto my-4 w-24 md:my-6 md:w-32' />

            <div className='space-y-3 md:space-y-4'>
              <div className='flex items-center justify-center gap-2'>
                <MapPin className='h-4 w-4 text-gold md:h-5 md:w-5' />
                <span className='font-barlow font-bold text-gray-400 text-xs uppercase tracking-widest md:text-sm'>
                  {clinic.address ? clinic.address : 'Endereço não informado'}
                </span>
              </div>
              <div className='font-barlow text-base text-cream uppercase tracking-[0.2em] md:text-lg md:tracking-[0.3em]'>
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
                className='space-y-4 border-gold border-l-4 bg-black p-6 shadow-2xl md:space-y-6 md:p-10'
                onSubmit={form.handleSubmit(handleRegisterAppointmnent)}
              >
                <div className='label !text-gold !mb-4 md:!mb-6'>
                  01 — Seus Dados
                </div>

                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='font-bebas text-gold text-lg tracking-widest'>
                        Nome completo:
                      </FormLabel>
                      <FormControl>
                        <Input
                          className='border-zinc-800 bg-zinc-900 text-cream placeholder:text-zinc-600'
                          id='name'
                          placeholder='Digite seu nome completo...'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='font-bebas text-gold text-lg tracking-widest'>
                          Email:
                        </FormLabel>
                        <FormControl>
                          <Input
                            className='border-zinc-800 bg-zinc-900 text-cream placeholder:text-zinc-600'
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
                        <FormLabel className='font-bebas text-gold text-lg tracking-widest'>
                          Telefone:
                        </FormLabel>
                        <FormControl>
                          <Input
                            className='border-zinc-800 bg-zinc-900 text-cream placeholder:text-zinc-600'
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

                <div className='label !color-gold !mb-6 !mt-10'>
                  02 — Horário e Serviço
                </div>

                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='date'
                    render={({ field }) => (
                      <FormItem className='flex flex-col gap-2'>
                        <FormLabel className='font-bebas text-gold text-lg tracking-widest'>
                          Data do agendamento:
                        </FormLabel>
                        <FormControl>
                          <DateTimePicker
                            className='w-full rounded-none border-gold border-b-2 bg-zinc-900 p-2 text-cream'
                            initialDate={new Date()}
                            onChange={(date) => {
                              if (date) {
                                const y = date.getFullYear()
                                const m = String(date.getMonth() + 1).padStart(
                                  2,
                                  '0'
                                )
                                const d = String(date.getDate()).padStart(
                                  2,
                                  '0'
                                )
                                const dateString = `${y}-${m}-${d}`
                                field.onChange(dateString)
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
                        <FormLabel className='font-bebas text-gold text-lg tracking-widest'>
                          Selecione o serviço:
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value)
                              setSelectedTime('')
                            }}
                          >
                            <SelectTrigger className='w-full border-zinc-800 bg-zinc-900 text-cream'>
                              <SelectValue placeholder='Selecione um serviço' />
                            </SelectTrigger>
                            <SelectContent className='border-gold bg-black text-cream'>
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

                  <FormField
                    control={form.control}
                    name='staffId'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='font-bebas text-gold text-lg tracking-widest'>
                          Selecione o profissional:
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value)
                              setSelectedTime('')
                            }}
                          >
                            <SelectTrigger className='w-full border-zinc-800 bg-zinc-900 text-cream'>
                              <SelectValue placeholder='Selecione um profissional' />
                            </SelectTrigger>
                            <SelectContent className='border-gold bg-black text-cream'>
                              {(selectedServiceId
                                ? staffForSelectedService
                                : clinic.staff
                              ).map((staffMember) => (
                                <SelectItem
                                  key={staffMember.id}
                                  value={staffMember.id}
                                >
                                  {staffMember.name}
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
                  <div className='mt-6 space-y-2'>
                    <Label className='font-bebas text-gold text-lg tracking-widest'>
                      Horários disponíveis:
                    </Label>
                    <div className='border border-zinc-800 bg-zinc-900 p-6'>
                      {loadingSlots ? (
                        <p className='font-barlow text-gold uppercase tracking-widest'>
                          Carregando horários...
                        </p>
                      ) : availableTimeSlots.length === 0 ? (
                        <p className='font-barlow text-gray-500 uppercase tracking-widest'>
                          Nenhum horário disponível
                        </p>
                      ) : (
                        <ScheduleTimeList
                          availableTimeSlots={availableTimeSlots}
                          clinicOpen={clinic.status}
                          onSelectTime={(time) => setSelectedTime(time)}
                          selectedDate={toLocalDate(selectedDate)}
                        />
                      )}
                    </div>
                  </div>
                )}

                {clinic.status ? (
                  <Button
                    className='mt-8 w-full'
                    disabled={
                      !(
                        watch('name') &&
                        watch('email') &&
                        watch('phone') &&
                        watch('date')
                      )
                    }
                    type='submit'
                    variant='default'
                  >
                    Confirmar Agendamento
                  </Button>
                ) : (
                  <p className='mt-8 bg-barber-red px-4 py-3 text-center font-barlow font-bold text-white uppercase tracking-widest'>
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
