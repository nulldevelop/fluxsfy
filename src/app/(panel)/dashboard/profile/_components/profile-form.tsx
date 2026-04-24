import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';

interface UserProfileFormProps {
  name: string | null;
  address: string | null;
  phone: string | null;
  status: boolean;
  timeZone: string | null;
  slug: string | null;
}

const profileSchema = z.object({
  name: z.string().min(2, 'O nome é obrigatório!'),
  address: z.string().optional(),
  phone: z.string().optional(),
  status: z.string(),
  timeZone: z.string().min(1, 'O time zone é obrigatório!'),
  slug: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export function useProfileForm({
  name,
  address,
  phone,
  status,
  timeZone,
  slug,
}: UserProfileFormProps) {
  return useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: name || '',
      address: address || '',
      phone: phone || '',
      status: status ? 'active' : 'inactive',
      timeZone: timeZone || '',
      slug: slug || '',
    },
  });
}
