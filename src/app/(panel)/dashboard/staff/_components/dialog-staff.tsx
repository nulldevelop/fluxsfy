'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Service } from '@prisma/client'
import { Loader, Upload, User, X } from 'lucide-react'
import Image from 'next/image'
import { type ChangeEvent, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod/v4'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Staff } from '@/generated/client/client'
import { cn } from '@/lib/utils'
import { createStaff, updateStaff } from '../_actions/staff-actions'

const staffSchema = z.object({
  name: z.string().min(2, 'O nome é obrigatório'),
  phone: z.string().optional(),
  image: z.string().optional(),
  services: z.array(z.string()).min(1, 'Selecione ao menos um serviço'),
  status: z.boolean(),
})

type StaffFormData = z.infer<typeof staffSchema>

interface DialogStaffProps {
  closeModal: () => void
  services: Service[]
  initialValues?: Staff & { services: Service[] }
  staffId?: string
}

export function DialogStaff({
  closeModal,
  services,
  initialValues,
  staffId,
}: DialogStaffProps) {
  const [isPending, startTransition] = useTransition()
  const [selectedHours, setSelectedHours] = useState<string[]>(
    (initialValues?.times as string[]) ?? []
  )
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialValues?.image || null
  )
  const [uploadingImage, setUploadingImage] = useState(false)

  const form = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      name: initialValues?.name ?? '',
      phone: initialValues?.phone ?? '',
      image: initialValues?.image ?? '',
      services: initialValues?.services.map((s) => s.id) ?? [],
      status: initialValues?.status ?? true,
    },
  })

  function generateTimeSlots(): string[] {
    const hours: string[] = []
    for (let i = 8; i <= 24; i++) {
      for (let j = 0; j < 2; j++) {
        const hour = i.toString().padStart(2, '0')
        const minute = (j * 30).toString().padStart(2, '0')
        hours.push(`${hour}:${minute}`)
      }
    }
    return hours
  }

  const hours = generateTimeSlots()

  function toggleHour(hour: string) {
    setSelectedHours((prev) =>
      prev.includes(hour)
        ? prev.filter((h) => h !== hour)
        : [...prev, hour].sort()
    )
  }

  async function handleImageUpload(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.[0]) return

    const file = e.target.files[0]
    if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
      toast.error('Formato inválido. Use JPG ou PNG.')
      return
    }

    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('userId', staffId || 'new')

      const res = await fetch('/api/image/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (data.secure_url) {
        setImagePreview(data.secure_url)
        form.setValue('image', data.secure_url)
        toast.success('Imagem enviada com sucesso!')
      } else {
        toast.error('Falha ao enviar imagem')
      }
    } catch {
      toast.error('Erro ao enviar imagem')
    } finally {
      setUploadingImage(false)
    }
  }

  async function onSubmit(values: StaffFormData) {
    startTransition(async () => {
      const payload = {
        ...values,
        times: selectedHours,
      }

      const response = staffId
        ? await updateStaff(staffId, payload)
        : await createStaff(payload)

      if (response.error) {
        toast.error(response.error)
      } else {
        toast.success(response.data)
        closeModal()
      }
    })
  }

  return (
    <Form {...form}>
      <form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Funcionário</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='Ex: João Silva' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='phone'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone (opcional)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='(00) 00000-0000' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='space-y-3'>
          <Label>Foto do Funcionário</Label>
          <div className='flex items-center gap-4'>
            <div className='relative h-20 w-20 overflow-hidden rounded-full bg-zinc-800'>
              {imagePreview ? (
                <Image
                  alt='Preview'
                  className='object-cover'
                  fill
                  src={imagePreview}
                />
              ) : (
                <div className='flex h-full w-full items-center justify-center'>
                  <User className='h-8 w-8 text-zinc-500' />
                </div>
              )}
            </div>
            <div className='flex-1'>
              <Label
                className={cn(
                  'cursor-pointer rounded-md bg-zinc-800 px-4 py-2 text-sm text-white hover:bg-zinc-700',
                  uploadingImage && 'opacity-50'
                )}
                htmlFor='staff-image-upload'
              >
                {uploadingImage ? (
                  <Loader className='mr-2 h-4 w-4 animate-spin' />
                ) : (
                  <Upload className='mr-2 h-4 w-4' />
                )}
                {imagePreview ? 'Trocar Foto' : 'Adicionar Foto'}
              </Label>
              <input
                accept='image/jpeg,image/png'
                className='hidden'
                id='staff-image-upload'
                onChange={handleImageUpload}
                type='file'
              />
              {imagePreview && (
                <Button
                  className='ml-2'
                  onClick={() => {
                    setImagePreview(null)
                    form.setValue('image', '')
                  }}
                  size='sm'
                  type='button'
                  variant='destructive'
                >
                  <X className='h-4 w-4' />
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className='space-y-3'>
          <Label>Serviços Realizados</Label>
          <div className='grid max-h-40 grid-cols-2 gap-2 overflow-y-auto rounded-md border p-4'>
            {services.map((service) => (
              <FormField
                control={form.control}
                key={service.id}
                name='services'
                render={({ field }) => {
                  return (
                    <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(service.id)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, service.id])
                              : field.onChange(
                                  field.value?.filter(
                                    (value) => value !== service.id
                                  )
                                )
                          }}
                        />
                      </FormControl>
                      <FormLabel className='cursor-pointer font-normal text-sm'>
                        {service.name}
                      </FormLabel>
                    </FormItem>
                  )
                }}
              />
            ))}
          </div>
          <FormMessage>{form.formState.errors.services?.message}</FormMessage>
        </div>

        <div className='space-y-3'>
          <Label>Horários de Trabalho</Label>
          <div className='rounded-md border p-4'>
            <p className='mb-4 text-muted-foreground text-xs'>
              Selecione os horários que este funcionário estará disponível para
              agendamentos.
            </p>
            <div className='grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8'>
              {hours.map((hour) => (
                <Button
                  className={cn(
                    'h-8 p-0 text-xs',
                    selectedHours.includes(hour) &&
                      'bg-emerald-500 hover:bg-emerald-600'
                  )}
                  key={hour}
                  onClick={() => toggleHour(hour)}
                  type='button'
                  variant={selectedHours.includes(hour) ? 'default' : 'outline'}
                >
                  {hour}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <Button
          className='w-full bg-emerald-500 hover:bg-emerald-600'
          disabled={isPending}
          type='submit'
        >
          {isPending ? <Loader className='mr-2 h-4 w-4 animate-spin' /> : null}
          {staffId ? 'Salvar Alterações' : 'Criar Funcionário'}
        </Button>
      </form>
    </Form>
  )
}
