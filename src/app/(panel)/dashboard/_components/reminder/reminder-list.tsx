'use client'

import type { Reminder } from '@prisma/client'
import { Plus, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { deleteReminder } from '../../_actions/delete-reminder'
import { ReminderContent } from './reminder-content'

interface ReminderListProps {
  reminder: Reminder[]
}
export function ReminderList({ reminder }: ReminderListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const router = useRouter()

  async function handleDeleteReminder(id: string) {
    const response = await deleteReminder({ reminderId: id })

    if (response.error) {
      toast.error(response.error)
      return
    }

    toast.success(response.data)
    router.refresh()
  }

  return (
    <div className='flex flex-col gap-3 '>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle className='font-bold text-xl md:text-2xl'>
            Lembretes
          </CardTitle>

          <Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
            <DialogTrigger asChild>
              <Button className='w-9 p-0' size={'sm'} variant={'ghost'}>
                <Plus className='h-4 w-4' />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo lembrete</DialogTitle>
                <DialogDescription>Criar novo lembrete</DialogDescription>
              </DialogHeader>
              <ReminderContent
                closeDialog={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent>
          {reminder.length === 0 && (
            <p className='text-gray-500 text-sm'>Nenhum lembrete cadastrado</p>
          )}
          <ScrollArea className='h-[340] w-full flex-1 pr-0 lg:max-h-[calc(100vh-15rem)]'>
            {reminder.map((reminder) => (
              <article
                className='mb-2 flex flex-row flex-wrap items-center justify-between border-l-2 border-gold bg-zinc-900 px-4 py-2'
                key={reminder.id}
              >
                <p className='text-sm text-cream'>{reminder.description}</p>
                <Button
                  className='hover:bg-destructive/20 text-destructive'
                  onClick={() => handleDeleteReminder(reminder.id)}
                  size={'icon'}
                  variant={'ghost'}
                >
                  <Trash className='h-4 w-4' />
                </Button>
              </article>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
