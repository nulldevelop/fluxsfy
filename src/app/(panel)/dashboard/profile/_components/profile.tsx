'use client';
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
import { useProfileForm } from './profile-form';

export function ProfileContent() {
  const [selectedHours, setSelectedHours] = useState<string[]>([]);
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  const form = useProfileForm();

  function generateTimeSlot(): string[] {
    const hours: string[] = [];
    for (let i = 7; i <= 24; i++) {
      for (let j = 0; j < 2; j++) {
        const hour = i.toString().padStart(2, '0');
        const minute = (j * 30).toString().padStart(2, '0');
        hours.push(`${hour}:${minute}`);
      }
    }
    return hours;
  }

  const hours = generateTimeSlot();

  function toggleHour(hour: string) {
    setSelectedHours((prev) =>
      prev.includes(hour)
        ? prev.filter((h) => h !== hour)
        : [...prev, hour].sort()
    );
  }

  return (
    <div className="mx-3">
      <Form {...form}>
        <form>
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
                    src="/medic2.png"
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
                          <SelectTrigger>
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
              </div>

              <div className="space-y-2">
                <Label className="font-semibold">
                  Configurar horários da clinica
                </Label>
                <Dialog onOpenChange={setDialogIsOpen} open={dialogIsOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full cursor-pointer justify-between"
                      variant="outline"
                    >
                      Clique aqui para selecionar horários
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Horários da Clinica</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                      Selecione abaixo os horários de funcionamento da clinica:
                    </DialogDescription>

                    <section className="py-4">
                      <p className="mb-2 text-muted-foreground text-sm">
                        Clique nos horários abaixo para marcar ou desmarcar:
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
                      Salvar hórarios
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
                      Selecione o Fuso Horário
                    </FormLabel>
                    <FormControl>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o Fuso Horário" />
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
            </CardContent>


      </Card>
  
    </form>
  
  </Form>
  
</div>
t

      ;
  ;
Select;
   defaultVa
e=
{
  field.value ? 'active' :
inactive';
}
onValueChange=
ield.onChange}
                     
 
  >
                        <SelectT;
r
        <SelectValue placehold
="Selecione o status da
lincia" />
                        </S
ectTrigger>
                        <SelectContent>
                          <Sele
Item value="active">
                  
        ATIVO (clinica aberta)
       
                 </SelectItem>
                     
   <SelectItem
value=INATIVO (clinica fechada)<

                          "inactive"
<
electItem>
                        <
SelectContent>
 
                   </Select>
                    </F
   </FormItem

                )}
              />
 
         </CardContent>
      
  </Card>
        </form>
      
Form>
    </div>
  )
}










