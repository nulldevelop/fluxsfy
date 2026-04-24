'use client'
import type { Service, Staff } from '@prisma/client'
import { ArrowRight, Loader } from 'lucide-react'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod/v4'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
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
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { createStaff, updateStaff } from '../_actions/staff-actions'

const staffSchema = z.object({
  name: z.string().min(2, 'O nome é obrigatório'),
  phone: z.string().optional(),
  services: z.array(z.string()).min(1, 'Selecione ao menos um serviço'),
  status: z.boolean().default(true),
})

type StaffFormData = z.infer<typeof staffSchema>

interface DialogStaffProps {
  closeModal: () => void
  services: Service[]
  initialValues?: Staff & { services: Service[] }
  staffId?: string
}

export function DialogStaff({ closeModal, services, initialValues, staffId }: DialogStaffProps) {
  const [isPending, startTransition] = useTransition()
  const [selectedHours, setSelectedHours] = useState<string[]>(
    (initialValues?.times as string[]) ?? []
  )

  const form = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      name: initialValues?.name ?? '',
      phone: initialValues?.phone ?? '',
      services: initialValues?.services.map(s => s.id) ?? [],
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Funcionário</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ex: João Silva" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone (opcional)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="(00) 00000-0000" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-3">
          <Label>Serviços Realizados</Label>
          <div className="grid grid-cols-2 gap-2 border rounded-md p-4 max-h-40 overflow-y-auto">
            {services.map((service) => (
              <FormField
                key={service.id}
                control={form.control}
                name="services"
                render={({ field }) => {
                  return (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(service.id)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, service.id])
                              : field.onChange(
                                  field.value?.filter((value) => value !== service.id)
                                )
                          }}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal cursor-pointer">
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

        <div className="space-y-3">
          <Label>Horários de Trabalho</Label>
          <div className="p-4 border rounded-md">
            <p className="text-xs text-muted-foreground mb-4">
              Selecione os horários que este funcionário estará disponível para agendamentos.
            </p>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
              {hours.map((hour) => (
                <Button
                  key={hour}
                  type="button"
                  variant={selectedHours.includes(hour) ? "default" : "outline"}
                  className={cn(
                    "h-8 text-xs p-0",
                    selectedHours.includes(hour) && "bg-emerald-500 hover:bg-emerald-600"
                  )}
                  onClick={() => toggleHour(hour)}
                >
                  {hour}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-emerald-500 hover:bg-emerald-600"
          disabled={isPending}
        >
          {isPending ? <Loader className="animate-spin h-4 w-4 mr-2" /> : null}
          {staffId ? 'Salvar Alterações' : 'Criar Funcionário'}
        </Button>
      </form>
    </Form>
  )
}
