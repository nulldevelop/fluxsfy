import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: User & DefaultSession['user'];
  }
}

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified?: null | string | boolean;
  image?: string;
  stripe_custumer_id?: string;
  time: string[];
  address?: string;
  phone?: string;
  status: boolean;
  role?: 'USER' | 'ADMIN';
  createdAt: string;
  updateAt: string;
}
