'use client'
import { Pencil, Plus, User, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import type { service as Service, Staff } from '@/generated/client/client'
import type { ResultPermissionProp } from '@/utils/permissions/canPermission'
import { deleteStaff } from '../_actions/staff-actions'
import { DialogStaff } from './dialog-staff'

interface StaffWithServices extends Staff {
  service: Service[]
}

interface StaffListProps {
  staff: StaffWithServices[]
  services: Service[]
  permissions: ResultPermissionProp
}

export function StaffList({ staff, services, permissions }: StaffListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<null | StaffWithServices>(
    null
  )

  async function handleDeleteStaff(id: string) {
    if (!confirm('Tem certeza que deseja remover este funcionário?')) return

    const response = await deleteStaff(id)

    if (response.error) {
      toast.error(response.error)
    } else {
      toast.success(response.data)
    }
  }

  function handleEditStaff(member: StaffWithServices) {
    setEditingStaff(member)
    setIsDialogOpen(true)
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        setIsDialogOpen(open)
        if (!open) setEditingStaff(null)
      }}
      open={isDialogOpen}
    >
      <section className='p-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='font-bold text-xl md:text-2xl'>
              Funcionários
            </CardTitle>

            {permissions.hasPermission ? (
              <DialogTrigger asChild>
                <Button>
                  <Plus className='mr-2 h-4 w-4' />
                  Novo Funcionário
                </Button>
              </DialogTrigger>
            ) : (
              <Link
                className='font-bold text-emerald-600 text-sm hover:underline'
                href={'/dashboard/plans'}
              >
                Limite atingido - Atualize seu plano
              </Link>
            )}

            <DialogContent className='max-h-[90vh] max-w-2xl overflow-y-auto'>
              <DialogStaff
                closeModal={() => {
                  setIsDialogOpen(false)
                  setEditingStaff(null)
                }}
                initialValues={editingStaff || undefined}
                services={services}
                staffId={editingStaff?.id}
              />
            </DialogContent>
          </CardHeader>

          <CardContent>
            <section className='mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {staff.map((member) => (
                <article
                  className='flex flex-col rounded-lg border bg-card p-4 text-card-foreground shadow-sm'
                  key={member.id}
                >
                  <div className='mb-4 flex items-center space-x-4'>
                    <div className='flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-secondary'>
                      {member.image ? (
                        <img
                          alt={member.name}
                          className='h-full w-full object-cover'
                          src={member.image}
                        />
                      ) : (
                        <User className='h-6 w-6 text-muted-foreground' />
                      )}
                    </div>
                    <div>
                      <h3 className='font-bold'>{member.name}</h3>
                      <p className='text-muted-foreground text-sm'>
                        {member.phone || 'Sem telefone'}
                      </p>
                    </div>
                  </div>

                  <div className='mb-4'>
                    <p className='mb-1 font-semibold text-muted-foreground text-xs uppercase'>
                      Serviços
                    </p>
                    <div className='flex flex-wrap gap-1'>
                      {member.service.map((s) => (
                        <span
                          className='rounded-full bg-emerald-100 px-2 py-0.5 font-medium text-[10px] text-emerald-800'
                          key={s.id}
                        >
                          {s.name}
                        </span>
                      ))}
                      {member.service.length === 0 && (
                        <span className='text-muted-foreground text-xs italic'>
                          Nenhum serviço vinculado
                        </span>
                      )}
                    </div>
                  </div>

                  <div className='mt-auto flex gap-2 border-t pt-4'>
                    <Button
                      className='flex-1'
                      onClick={() => handleEditStaff(member)}
                      size='sm'
                      variant='outline'
                    >
                      <Pencil className='mr-2 h-4 w-4' />
                      Editar
                    </Button>
                    <Button
                      onClick={() => handleDeleteStaff(member.id)}
                      size='sm'
                      variant='destructive'
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  </div>
                </article>
              ))}
              {staff.length === 0 && (
                <div className='col-span-full py-10 text-center text-muted-foreground'>
                  Nenhum funcionário cadastrado.
                </div>
              )}
            </section>
          </CardContent>
        </Card>
      </section>
    </Dialog>
  )
}
