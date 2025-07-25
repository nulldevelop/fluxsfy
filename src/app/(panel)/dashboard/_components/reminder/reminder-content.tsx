'use client'

import { useRouter } from 'next/navigation'
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
import { Textarea } from '@/components/ui/textarea'
import { createReminder } from '../../_actions/create-reminder'
import { type ReminderFormData, useReminderForm } from './reminder-form'

interface ReminderContentProps {
  closeDialog: () => void
}

export function ReminderContent({closeDialog}: ReminderContentProps) {
  const router = useRouter()
  const form = useReminderForm()

  async function onSubmit(data: ReminderFormData) {
    const response = await createReminder({ description: data.description })

    if (response.error) {
      toast.error(response.error)
    }

    toast.success(response.data)
    form.reset()
    router.refresh()
    closeDialog()
  }

  return (
    <div className='grid gap-4 py-4'>
      <Form {...form}>
        <form
          className='flex flex-col gap-4'
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='font-semibold'>
                  Descreva o lembrete:
                </FormLabel>
                <FormControl>
                  <Textarea
                    className='max-h-52 resize-none overflow-y-auto'
                    {...field}
                    placeholder='Digite o lembrete'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={!form.watch('description')} type='submit'>
            Cadastrar lembrete
          </Button>
        </form>
      </Form>
    </div>
  )
}
