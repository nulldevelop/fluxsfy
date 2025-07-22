'use client';
import type { Prisma } from '@prisma/client';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { updateProfile } from '../_actions/update-profile';
import { type ProfileFormData, useProfileForm } from './profile-form';

type UserWithSubscrition = Prisma.UserGetPayload<{
  include: {
    subscription: true;
  };
}>;

interface ProfileContentProps {
  user: UserWithSubscrition;
}
export function ProfileContent({ user }: ProfileContentProps) {
  const [selectedHours, setSelectedHours] = useState<string[]>(
    user.times ?? []
  );
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  const form = useProfileForm({
    name: user.name,
    address: user.address,
    phone: user.phone,
    status: user.status,
    timeZone: user.timeZone,
  });

  function generateTimeSlots(): string[] {
    const hours: string[] = [];

    for (let i = 8; i <= 24; i++) {
      for (let j = 0; j < 2; j++) {
        const hour = i.toString().padStart(2, '0');
        const minute = (j * 30).toString().padStart(2, '0');
        hours.push(`${hour}:${minute}`);
      }
    }

    return hours;
  }

  const hours = generateTimeSlots();

  function toggleHour(hour: string) {
    setSelectedHours((prev) =>
      prev.includes(hour)
        ? prev.filter((h) => h !== hour)
        : [...prev, hour].sort()
    );
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
  );

  async function onSubmit(values: ProfileFormData) {
    const response = await updateProfile({
      name: values.name,
      address: values.address,
      phone: values.phone, 
      status: values.status === 'active' ? true : false,
      timeZone: values.timeZone,
      times: selectedHours || [],
    });

    console.info('resposta', response);
  }

  return (
    <div className="mx-3">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Meu Perfil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <div className="relative h-40 w-40 overflow-hidden rounded-full bg-gray-200">
                  <Image
                    alt="Foto da clinica"
                    className="object-cover"
                    fill
                    src={user.image ? user.image : 'medic2.png'}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Nome completo
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Digite o nome da clinica..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Endereço completo:
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Digite o endereço da clinica..."
                        />
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
                      <FormLabel className="font-semibold">Telefone</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Digite o telefone..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Status da clinica
                      </FormLabel>
                      <FormControl>
                        <Select
                          defaultValue={field.value ? 'active' : 'inactive'}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione o status da clincia" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">
                              ATIVO (clinica aberta)
                            </SelectItem>
                            <SelectItem value="inactive">
                              INATIVO (clinica fechada)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <Label className="font-semibold">
                    Configurar horários da clinica
                  </Label>

                  <Dialog onOpenChange={setDialogIsOpen} open={dialogIsOpen}>
                    <DialogTrigger asChild>
                      <Button
                        className="w-full justify-between"
                        variant="outline"
                      >
                        Clique aqui para selecionar horários
                        <ArrowRight className="h-5 w-5" />
                      </Button>
                    </DialogTrigger>

                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Horários da clinica</DialogTitle>
                        <DialogDescription>
                          Selecione abaixo os horários de funcionamento da
                          clinica:
                        </DialogDescription>
                      </DialogHeader>

                      <section className="py-4">
                        <p className="mb-2 text-muted-foreground text-sm">
                          Clique nos horários abaixo para marcar ou desmcar:
                        </p>

                        <div className="grid grid-cols-5 gap-2">
                          {hours.map((hour) => (
                            <Button
                              className={cn(
                                'h-10',
                                selectedHours.includes(hour) &&
                                  'border-2 border-emerald-500 text-primary'
                              )}
                              key={hour}
                              onClick={() => toggleHour(hour)}
                              variant="outline"
                            >
                              {hour}
                            </Button>
                          ))}
                        </div>
                      </section>

                      <Button
                        className="w-full"
                        onClick={() => setDialogIsOpen(false)}
                      >
                        Fechar modal
                      </Button>
                    </DialogContent>
                  </Dialog>
                </div>

                <FormField
                  control={form.control}
                  name="timeZone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Selecione o fuso horário
                      </FormLabel>
                      <FormControl>
                        <Select
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione o seu fuso horário" />
                          </SelectTrigger>
                          <SelectContent>
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

                <Button
                  className="w-full bg-emerald-500 hover:bg-emerald-400"
                  type="submit"
                >
                  Salvar alterações
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
