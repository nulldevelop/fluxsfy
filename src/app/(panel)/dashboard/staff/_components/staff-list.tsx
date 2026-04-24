'use client'
import type { Staff, Service } from '@prisma/client'
import { Pencil, Plus, X, User } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import type { ResultPermissionProp } from '@/utils/permissions/canPermission'
import { deleteStaff } from '../_actions/staff-actions'
import { DialogStaff } from './dialog-staff'

interface StaffWithServices extends Staff {
  services: Service[]
}

interface StaffListProps {
  staff: StaffWithServices[]
  services: Service[]
  permissions: ResultPermissionProp
}

export function StaffList({ staff, services, permissions }: StaffListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<null | StaffWithServices>(null)

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
            <DialogTrigger asChild>
              <Button>
                <Plus className='h-4 w-4 mr-2' />
                Novo Funcionário
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogStaff
                closeModal={() => {
                  setIsDialogOpen(false)
                  setEditingStaff(null)
                }}
                services={services}
                initialValues={editingStaff || undefined}
                staffId={editingStaff?.id}
              />
            </DialogContent>
          </CardHeader>

          <CardContent>
            <section className='mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {staff.map((member) => (
                <article
                  className='flex flex-col p-4 border rounded-lg bg-card text-card-foreground shadow-sm'
                  key={member.id}
                >
                  <div className='flex items-center space-x-4 mb-4'>
                    <div className='h-12 w-12 rounded-full bg-secondary flex items-center justify-center overflow-hidden'>
                      {member.image ? (
                        <img src={member.image} alt={member.name} className="h-full w-full object-cover" />
                      ) : (
                        <User className='h-6 w-6 text-muted-foreground' />
                      )}
                    </div>
                    <div>
                      <h3 className='font-bold'>{member.name}</h3>
                      <p className='text-sm text-muted-foreground'>{member.phone || 'Sem telefone'}</p>
                    </div>
                  </div>

                  <div className='mb-4'>
                    <p className='text-xs font-semibold uppercase text-muted-foreground mb-1'>Serviços</p>
                    <div className='flex flex-wrap gap-1'>
                      {member.services.map(s => (
                        <span key={s.id} className='px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] rounded-full font-medium'>
                          {s.name}
                        </span>
                      ))}
                      {member.services.length === 0 && <span className='text-xs text-muted-foreground italic'>Nenhum serviço vinculado</span>}
                    </div>
                  </div>

                  <div className='flex gap-2 mt-auto pt-4 border-t'>
                    <Button
                      onClick={() => handleEditStaff(member)}
                      size='sm'
                      variant='outline'
                      className='flex-1'
                    >
                      <Pencil className='h-4 w-4 mr-2' />
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
