'use client'

import type { Prisma } from '@prisma/client'
import { MapPin } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatPhone } from '@/utils/formatPhone'
import {
  type ClinicAppointmentFormData,
  useClinicAppointmentForm,
} from './clinics-form'
import { DateTimePicker } from './date-picker'

type UserWithServiceAndSubscription = Prisma.UserGetPayload<{
  include: {
    subscription: true
    services: true
  }
}>

interface ClinicContentProps {
  clinic: UserWithServiceAndSubscription
}

interface TimeSlot {
  time: string
  available: boolean
}

export function ClinicContent({ clinic }: ClinicContentProps) {
  const form = useClinicAppointmentForm()
  const { watch } = form
  const [selectedTime, setSelectedTime] = useState('')
  const [availableTimeSlot, setAvailableTimeSlot] = useState<TimeSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [blokedTimes, setBlockedTimes] = useState<string[]>([])

  async function fetchBlockedTimes(){
    setLoadingSlots(true)
    try{
      const reponse = await fetch('')
    } catch {
      setLoadingSlots(false)
      return []
    }
  }

  function handleRegisterAppointment(formData: ClinicAppointmentFormData) {
    console.info(formData)
  }

  return (
    <div className='flex min-h-screen flex-col'>
      <section className='h-32 bg-emerald-500' />
      <section className='-mt-16 container mx-auto px-4'>
        <div className='mx-auto max-w-2xl'>
          <article className='flex flex-col items-center'>
            <div className='relative mb-8 h-48 w-48 overflow-hidden rounded-full border-4 border-white'>
              <Image
                alt='Foto da clinica'
                className='object-cover'
                fill
                src={clinic.image ? clinic.image : '/medic.jpg'}
              />
            </div>
            <h1 className='mb-2 font-bold text-2xl'>{clinic.name}</h1>
            <div className='flex items-center gap-1'>
              <MapPin className='h-5 w-5' />
              <span>
                {clinic.address ? clinic.address : 'Endereço não informado'}
              </span>
            </div>
          </article>
        </div>
      </section>

      <section className='mx-auto mt-6 w-full max-w-2xl'>
        <Form {...form}>
          <form
            className='mx-2 space-y-6 rounded-md border bg-white p-6 shadow-sm'
            onSubmit={form.handleSubmit(handleRegisterAppointment)}
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <div>
                  <FormItem className='my-2'>
                    <FormLabel className='font-semibold'>
                      Nome Completo...
                    </FormLabel>
                    <FormControl>
                      <Input
                        id='name'
                        placeholder='Digite seu nome comepleto'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />

            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <div>
                  <FormItem className='my-2'>
                    <FormLabel className='font-semibold'>E-mail</FormLabel>
                    <FormControl>
                      <Input
                        id='email'
                        placeholder='Digite seu email...'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />

            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <div>
                  <FormItem className='my-2'>
                    <FormLabel className='font-semibold'>Telefone:</FormLabel>
                    <FormControl>
                      <Input
                        id='phone'
                        {...field}
                        onChange={(e) => {
                          const formatedValue = formatPhone(e.target.value)
                          field.onChange(formatedValue)
                        }}
                        placeholder='(XX) XXXXX-XXXX'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />

            <FormField
              control={form.control}
              name='date'
              render={({ field }) => (
                <div>
                  <FormItem className='my-2 flex items-center gap-2 space-y-1'>
                    <FormLabel className='font-semibold'>
                      Data de agendamento:
                    </FormLabel>
                    <FormControl>
                      <DateTimePicker
                        className='w-full rounded border p-2'
                        inicitalDate={new Date()}
                        onChange={(date) => {
                          if (date) {
                            field.onChange(date)
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />

            <FormField
              control={form.control}
              name='serviceId'
              render={({ field }) => (
                <FormItem className=''>
                  <FormLabel className='font-semibold'>
                    Selecione o serviço:
                  </FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Selecione um serviço' />
                      </SelectTrigger>
                      <SelectContent>
                        {clinic.services.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name} ({Math.floor(service.duration / 60)}h
                            {service.duration % 60}min)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
              <p className='rounded-md px-4 py-2 text-center text-red-500'>
                A clinica esta fechada nesse momento.
              </p>
            )}
          </form>
        </Form>
      </section>
    </div>
  )
}
