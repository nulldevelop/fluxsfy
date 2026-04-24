'use client'
import type { Service } from '@prisma/client'
import { Pencil, Plus, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { formatCurrency } from '@/utils/formatCurrency'
import type { ResultPermissionProp } from '@/utils/permissions/canPermission'
import { deleteService } from '../_actions/delete-service'
import { DialogService } from './dialog-service'

interface ServiceListProps {
  services: Service[]
  permissions: ResultPermissionProp
}

export function ServiceList({ services, permissions }: ServiceListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editindService, setEditingService] = useState<null | Service>(null)
  const servicesList = permissions.hasPermission
    ? services
    : services.slice(0, 3)

  async function handleDeleteService(serviceId: string) {
    const response = await deleteService({ serviceId })

    if (response.error) {
      toast.error(response.error)
    }

    toast.success(response.data)
  }

  function handleEditService(service: Service) {
    setEditingService(service)
    setIsDialogOpen(true)
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        setIsDialogOpen(open)
        if (!open) {
          setEditingService(null)
        }
      }}
      open={isDialogOpen}
    >
      <section>
        <Card className='mx-3'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-6'>
            <CardTitle className='font-bebas text-4xl text-gold tracking-widest'>
              SERVIÇOS
            </CardTitle>
            {permissions.hasPermission && (
              <DialogTrigger asChild>
                <Button size="icon" variant="default">
                  <Plus className='h-5 w-5' />
                </Button>
              </DialogTrigger>
            )}

            {!permissions.hasPermission && (
              <Link
                className='font-barlow font-bold text-gold uppercase tracking-widest hover:underline text-sm'
                href={'/dashboard/plans'}
              >
                Limite atingido - Atualize seu plano
              </Link>
            )}

            <DialogContent
              className="bg-black border-gold text-cream"
              onInteractOutside={(e) => {
                e.preventDefault()
                setIsDialogOpen(false)
                setEditingService(null)
              }}
            >
              <DialogService
                closeModal={() => {
                  setIsDialogOpen(false)
                  setEditingService(null)
                }}
                initialValues={
                  editindService
                    ? {
                        name: editindService.name,
                        price: (editindService.price / 100)
                          .toFixed(2)
                          .replace('.', ','),
                        hours: Math.floor(
                          editindService.duration / 60
                        ).toString(),
                        minutes: (editindService.duration % 60).toString(),
                      }
                    : undefined
                }
                serviceId={editindService ? editindService.id : undefined}
              />
            </DialogContent>
          </CardHeader>

          <CardContent>
            <section className='space-y-4'>
              {servicesList.map((service) => (
                <article
                  className='flex items-center justify-between bg-zinc-900 p-4 border-l-4 border-gold group hover:bg-zinc-800 transition-colors'
                  key={service.id}
                >
                  <div className='flex flex-col'>
                    <span className='font-barlow font-bold text-cream uppercase tracking-widest'>{service.name}</span>
                    <div className='flex items-center gap-2 mt-1'>
                        <span className='font-bebas text-2xl text-gold'>
                        {formatCurrency(service.price / 100)}
                        </span>
                        <span className='text-zinc-600 font-barlow text-xs'>/</span>
                        <span className='text-zinc-500 font-barlow font-bold uppercase tracking-widest text-xs'>
                        {service.duration} MIN
                        </span>
                    </div>
                  </div>

                  <div className='flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                    <Button
                      onClick={() => handleEditService(service)}
                      size='icon'
                      variant='outline'
                      className="size-8"
                    >
                      <Pencil className='h-4 w-4' />
                    </Button>
                    <Button
                      className='cursor-pointer size-8'
                      onClick={() => handleDeleteService(service.id)}
                      size='icon'
                      variant='destructive'
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  </div>
                </article>
              ))}
            </section>
          </CardContent>
        </Card>
      </section>
    </Dialog>
  )
}
