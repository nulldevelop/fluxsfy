import { redirect } from 'next/navigation';
import getSesion from '@/lib/getSession';
import { ProfileContent } from './_components/profile';
import { getUserData } from './_data-access/get-info-user';

export default async function Profile() {
  const session = await getSesion();

  if (!session) {
    redirect('/');
  }

  const user = await getUserData({ userId: session.user?.id });

  if (!user) {
    redirect('/');
  }

  return <ProfileContent user={user}/>;
}
