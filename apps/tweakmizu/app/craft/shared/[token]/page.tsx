import { getProfileByShareToken } from '@/actions/craft-profiles';
import { notFound } from 'next/navigation';
import { SharedProfileView } from './shared-view';

export default async function SharedProfilePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const profile = await getProfileByShareToken(token);
  if (!profile) notFound();

  return <SharedProfileView profile={profile} />;
}
