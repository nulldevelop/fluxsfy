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
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='font-bold text-xl md:text-2xl'>
              Serviços
            </CardTitle>
            {permissions.hasPermission && (
              <DialogTrigger asChild>
                <Button>
                  <Plus className='h-4 w-4' />
                </Button>
              </DialogTrigger>
            )}

            {!permissions.hasPermission && (
              <Link
                className='text-emerald-500 text-sm hover:underline'
                href={'/dashboard/plans'}
              >
                Limite de serviços atingido - Atualize seu plano
              </Link>
            )}

            <DialogContent
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
            <section className='mt-4 space-y-4'>
              {servicesList.map((service) => (
                <article
                  className='flex flex-center justify-between'
                  key={service.id}
                >
                  <div className='flex items-center space-x-2'>
                    <span className='font-medium'>{service.name}</span>
                    <span className='text-gray-300'>-</span>
                    <span className='font-medium text-gray-500'>
                      {formatCurrency(service.price / 100)}
                    </span>
                    <span className='text-gray-300'>-</span>
                    <span className='font-medium text-gray-500'>
                      {service.duration}m
                    </span>
                  </div>

                  <div className='flex gap-2'>
                    <Button
                      onClick={() => handleEditService(service)}
                      size='icon'
                      variant='secondary'
                    >
                      <Pencil className='h-4 w-4' />
                    </Button>
                    <Button
                      className='cursor-pointer'
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
