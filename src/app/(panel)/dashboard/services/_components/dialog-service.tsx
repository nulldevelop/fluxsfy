'use client'
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { DialogHeader } from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { convertRealToCents } from '@/utils/convertCurrency'
import { createNewService } from '../_actions/create-service'
import { updateService } from '../_actions/update-service'
import {
  type DialogServiceFormData,
  useDialogserviceForm,
} from './dialog-service-form'

interface DialogServiceProps {
  closeModal: () => void
  serviceId?: string
  initialValues?: {
    name: string
    price: string
    hours: string
    minutes: string
  }
}

export function DialogService({
  closeModal,
  initialValues,
  serviceId,
}: DialogServiceProps) {
  const form = useDialogserviceForm({ initialValues })
  const [loading, setLoading] = useState(false)

  async function onSubmit(values: DialogServiceFormData) {
    setLoading(true)
    const priceInCents = convertRealToCents(values.price)
    const hours = Number.parseInt(values.hours) || 0
    const minutes = Number.parseInt(values.minutes) || 0

    const duration = hours * 60 + minutes

    if (serviceId) {
      await editServiceById({
        serviceId,
        name: values.name,
        priceInCents,
        duration,
      })
      return
    }

    const response = await createNewService({
      name: values.name,
      price: priceInCents,
      duration,
    })

    setLoading(false)

    if (response.error) {
      toast.error(response.error)
      return
    }

    toast.success('Serviço cadastrado com sucesso!')
    handleCloseModal()
  }

  function handleCloseModal() {
    form.reset()
    closeModal()
  }

  async function editServiceById({
    serviceId,
    name,
    priceInCents,
    duration,
  }: {
    serviceId: string
    name: string
    priceInCents: number
    duration: number
  }) {
    const response = await updateService({
      serviceId,
      name,
      price: priceInCents,
      duration,
    })

    setLoading(false)

    if (response.error) {
      toast.error(response.error)
      return
    }

    toast.success(response.data)
    handleCloseModal()
  }

  function changeCurrency(event: React.ChangeEvent<HTMLInputElement>) {
    let { value } = event.target
    value = value.replace(/\D/g, '')

    if (value) {
      value = (Number.parseInt(value, 10) / 100).toFixed(2)
      value = value.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    }
    event.target.value = value
    form.setValue('price', value)
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Novo Serviço</DialogTitle>
        <DialogDescription>Adicione um novo serviço</DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form className='space-y-2' onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem className='my-2'>
                  <FormLabel className='font-semibold'>
                    Nome do serviço
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Digite o nome do serviço' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='price'
              render={({ field }) => (
                <FormItem className='my-2'>
                  <FormLabel className='font-semibold'>
                    Valor do serviço
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={changeCurrency}
                      placeholder='R$19,00'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <p className='font-semibold'>Tempo de duração do serviço</p>
          <div className='grid grid-cols-2 gap-3'>
            <FormField
              control={form.control}
              name='hours'
              render={({ field }) => (
                <FormItem className='my-2'>
                  <FormLabel className='font-semibold'>Horas:</FormLabel>
                  <FormControl>
                    <Input {...field} min='0' placeholder='1' type='number' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='minutes'
              render={({ field }) => (
                <FormItem className='my-2'>
                  <FormLabel className='font-semibold'>Minutos:</FormLabel>
                  <FormControl>
                    <Input {...field} min='0' placeholder='0' type='number' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            className='w-full font-semibold text-white'
            disabled={loading}
            type='submit'
          >
            {loading
              ? 'Carregando...'
              : `${serviceId ? 'Atualizar serviço' : 'Cadastrar serviço'}`}
          </Button>
        </form>
      </Form>
    </>
  )
}
