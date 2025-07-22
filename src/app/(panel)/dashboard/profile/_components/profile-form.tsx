import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';

const profileSchema = z.object({
  name: z.string().min(2, 'O nome é obrigatório!'),
  address: z.string().optional(),
  phone: z.string().optional(),
  status: z.string(),
  timeZone: z.string().min(1, 'O time zone é obrigatório!'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function useProfileForm() {
  return useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      address: '',
      phone: '',
      status: '',
      timeZone: '',
    },
  });
}
