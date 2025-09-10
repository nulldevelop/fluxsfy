'use client'

import type { Prisma } from '@prisma/client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Eye, X } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cancelAppointment } from '../../_actions/cancel-appointment'
import { DialogAppointment } from './dialog-appointments'
import { ButtonDatePicker } from './button-date'

export type AppointmentWithService = Prisma.AppointmentGetPayload<{
  include: {
    service: true
  }
}>

interface AppointmentsListProps {
  times: string[]
}

export function AppointmentsList({ times }: AppointmentsListProps) {
  const searchParams = useSearchParams()
  const date = searchParams.get('date')
  const queryClient = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [detailAppointment, setDetailAppointment] =
    useState<AppointmentWithService | null>(null)

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['get-appointments', date],
    queryFn: async () => {
      let activeDate = date

      if (!activeDate) {
        const today = format(new Date(), 'yyyy-MM-dd')
        activeDate = today
      }

      const url = `${process.env.NEXT_PUBLIC_URL}/api/clinic/appointments?date=${activeDate}`

      const response = await fetch(url)

      const json = (await response.json()) as AppointmentWithService[]

      if (!response.ok) {
        return []
      }

      return json
    },
    staleTime: 20_000,
    refetchInterval: 30_000,
  })

  const occupantMap: Record<string, AppointmentWithService> = {}

  if (data && data.length > 0) {
    for (const appointment of data) {
      const requiredSlots = Math.ceil(appointment.service.duration / 30)
      const startIndex = times.indexOf(appointment.time)
      if (startIndex !== -1) {
        for (let i = 0; i < requiredSlots; i++) {
          const slotIndex = startIndex + i

          if (slotIndex < times.length) {
            occupantMap[times[slotIndex]] = appointment
          }
        }
      }
    }
  }

  async function handleCancelAppointment(appointmentId: string) {
    const reponse = await cancelAppointment({ appointmentIs: appointmentId })

    if (reponse.error) {
      toast.error(reponse.error)
    }

    queryClient.invalidateQueries({ queryKey: ['get-appointments'] })
    await refetch()
    toast.success(reponse.data)
  }

  return (
    <Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='font-bold text-xl md:text-2xl'>
            Agendamentos
          </CardTitle>

          <ButtonDatePicker />
        </CardHeader>

        <CardContent>
          <ScrollArea className='h-[calc(100vh-20rem)] pr-4 lg:h-[calc(100vh-15rem)]'>
            {isLoading ? (
              <p>Carregando agenda...</p>
            ) : (
              times.map((slot) => {
                // ocupantMap["15:00"]
                const occupant = occupantMap[slot]

                if (occupant) {
                  return (
                    <div
                      className='flex items-center border-t py-2 last:border-b'
                      key={slot}
                    >
                      <div className='w-16 font-semibold text-sm'>{slot}</div>
                      <div className='flex-1 text-sm'>
                        <div className='font-semibold'>{occupant.name}</div>
                        <div className='text-gray-500 text-sm'>
                          {occupant.phone}
                        </div>
                      </div>
                      <div className='ml-auto'>
                        <div className='flex gap-1'>
                          <DialogTrigger asChild>
                            <Button
                              onClick={() => {
                                setDetailAppointment(occupant)
                              }}
                              size={'icon'}
                              variant={'ghost'}
                            >
                              <Eye className='h-5 w-5' />
                            </Button>
                          </DialogTrigger>
                          <Button
                            onClick={() => handleCancelAppointment(occupant.id)}
                            size={'icon'}
                          >
                            <X className='h-5 w-5' />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                }

                return (
                  <div
                    className='flex items-center border-t py-2 last:border-b'
                    key={slot}
                  >
                    <div className='w-16 font-semibold text-sm'>{slot}</div>
                    <div className='flex-1 text-sm'>Disponível</div>
                  </div>
                )
              })
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <DialogAppointment appointment={detailAppointment} />
    </Dialog>
  )
}
