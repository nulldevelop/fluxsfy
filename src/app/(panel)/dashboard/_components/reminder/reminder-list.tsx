'use client'

import type { Reminder } from '@prisma/client'
import { Plus, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

interface ReminderListProps {
  reminder: Reminder[]
}
export function ReminderList({ reminder }: ReminderListProps) {
  return (
    <div className='flex flex-col gap-3 '>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle className='font-bold text-xl md:text-2xl'>
            Lembretes
          </CardTitle>
          <Button className='w-9 p-0' size={'sm'} variant={'ghost'}>
            <Plus className='h-4 w-4' />
          </Button>
        </CardHeader>
        <CardContent>
          {reminder.length === 0 && (
            <p className='text-gray-500 text-sm'>Nenhum lembrete cadastrado</p>
          )}
          <ScrollArea className='h-[340] w-full flex-1 pr-0 lg:max-h-[calc(100vh-15rem)]'>
            {reminder.map((reminder) => (
              <article
                className='mb-2 flex flex-row flex-wrap items-center justify-between rounded-md bg-yellow-100 px-2 py-2'
                key={reminder.id}
              >
                <p className='text-sm'>{reminder.description}</p>
                <Button
                  className='rounded-full bg-red-500 p-2 shadow-none hover:bg-red-400'
                  size={'sm'}
                >
                  <Trash className='h-4 w-4 text-white' />
                </Button>
              </article>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
