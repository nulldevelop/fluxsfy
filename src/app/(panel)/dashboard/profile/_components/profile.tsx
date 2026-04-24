'use client'
import type { Prisma } from '@prisma/client'
import { ArrowRight } from 'lucide-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { signOut, useSession } from '@/lib/auth-client'
import { cn } from '@/lib/utils'
import { formatPhone } from '@/utils/formatPhone'
import { updateProfile } from '../_actions/update-profile'
import { AvatarProfile } from './profile-avatar'
import { type ProfileFormData, useProfileForm } from './profile-form'

type UserWithSubscription = Prisma.UserGetPayload<{
  include: {
    subscription: true
  }
}>

interface ProfileContentProps {
  user: UserWithSubscription
}

export function ProfileContent({ user }: ProfileContentProps) {
  const router = useRouter()
  const [selectedHours, setSelectedHours] = useState<string[]>(user.times ?? [])
  const [dialogIsOpen, setDialogIsOpen] = useState(false)

  const form = useProfileForm({
    name: user.name,
    address: user.address,
    phone: user.phone,
    status: user.status,
    timeZone: user.timeZone,
    slug: user.slug,
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

  const timeZones = Intl.supportedValuesOf('timeZone').filter(
    (zone) =>
      zone.startsWith('America/Sao_Paulo') ||
      zone.startsWith('America/Fortaleza') ||
      zone.startsWith('America/Recife') ||
      zone.startsWith('America/Bahia') ||
      zone.startsWith('America/Belem') ||
      zone.startsWith('America/Manaus') ||
      zone.startsWith('America/Cuiaba') ||
      zone.startsWith('America/Boa_Vista')
  )

  async function onSubmit(values: ProfileFormData) {
    const response = await updateProfile({
      name: values.name,
      address: values.address,
      status: values.status === 'active' ? true : false,
      phone: values.phone,
      timeZone: values.timeZone,
      times: selectedHours || [],
      slug: values.slug,
    })

    if (response.error) {
      toast.error(response.error)
      return
    }

    toast.success(response.data)
  }

  async function handleLogout() {
    await signOut()
    router.replace('/')
  }

  return (
    <div className='mx-auto'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className='border-gold border-l-8'>
            <CardHeader>
              <CardTitle className='text-4xl'>Barbearia</CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='flex justify-center'>
                <AvatarProfile avatarUrl={user.image} userId={user.id} />
              </div>

              <div className='space-y-6'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='font-barlow font-bold text-gold uppercase tracking-widest'>
                        Nome completo
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder='Digite o nome da clinica...'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='address'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='font-barlow font-bold text-gold uppercase tracking-widest'>
                        Endereço completo:
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder='Digite o endereço da clinica...'
                        />
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
                      <FormLabel className='font-barlow font-bold text-gold uppercase tracking-widest'>
                        Telefone
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className='border-zinc-800 bg-zinc-900 text-cream'
                          onChange={(e) => {
                            const formattedValue = formatPhone(e.target.value)
                            field.onChange(formattedValue)
                          }}
                          placeholder='(67) 99912-3456'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='slug'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='font-barlow font-bold text-gold uppercase tracking-widest'>
                        Nome amigável (URL)
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='ex: minha-clinica' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='status'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='font-semibold'>
                        Status da clinica
                      </FormLabel>
                      <FormControl>
                        <Select
                          defaultValue={field.value ? 'active' : 'inactive'}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='Selecione o status da clincia' />
                          </SelectTrigger>
                          <SelectContent className='border-gold bg-black text-cream'>
                            <SelectItem value='active'>
                              ATIVO (barbearia aberta)
                            </SelectItem>
                            <SelectItem value='inactive'>
                              INATIVO (barbearia fechada)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className='space-y-2'>
                  <Label className='font-semibold'>
                    Configurar horários da clinica
                  </Label>

                  <Dialog onOpenChange={setDialogIsOpen} open={dialogIsOpen}>
                    <DialogTrigger asChild>
                      <Button
                        className='w-full justify-between'
                        variant='outline'
                      >
                        Clique aqui para selecionar horários
                        <ArrowRight className='h-5 w-5' />
                      </Button>
                    </DialogTrigger>

                    <DialogContent className='border-gold bg-black'>
                      <DialogHeader>
                        <DialogTitle>Horários da clinica</DialogTitle>
                        <DialogDescription>
                          Selecione abaixo os horários de funcionamento da
                          barbearia:
                        </DialogDescription>
                      </DialogHeader>

                      <section className='py-4'>
                        <p className='mb-4 font-bold text-xs text-zinc-400 uppercase tracking-widest'>
                          Clique nos horários abaixo para marcar ou desmarcar:
                        </p>

                        <div className='grid grid-cols-5 gap-2'>
                          {hours.map((hour) => (
                            <Button
                              className={cn(
                                'h-10 border-zinc-800',
                                selectedHours.includes(hour) &&
                                  'border-2 border-gold bg-gold/10 text-gold'
                              )}
                              key={hour}
                              onClick={() => toggleHour(hour)}
                              variant='outline'
                            >
                              {hour}
                            </Button>
                          ))}
                        </div>
                      </section>

                      <Button
                        className='w-full'
                        onClick={() => setDialogIsOpen(false)}
                      >
                        Fechar modal
                      </Button>
                    </DialogContent>
                  </Dialog>
                </div>

                <FormField
                  control={form.control}
                  name='timeZone'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='font-barlow font-bold text-gold uppercase tracking-widest'>
                        Selecione o fuso horário
                      </FormLabel>
                      <FormControl>
                        <Select
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className='border-zinc-800 bg-zinc-900 text-cream'>
                            <SelectValue placeholder='Selecione o seu fuso horário' />
                          </SelectTrigger>
                          <SelectContent className='border-gold bg-black text-cream'>
                            {timeZones.map((zone) => (
                              <SelectItem key={zone} value={zone}>
                                {zone}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button className='w-full' type='submit'>
                  Salvar alterações
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>

      <section className='mt-4'>
        <Button onClick={handleLogout} variant='destructive'>
          Sair da conta
        </Button>
      </section>
    </div>
  )
}
