'use client';

import { Button, Inline } from '@aspect/react';
import { LogOut, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

export function UserMenu() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  if (isPending) {
    return null;
  }

  if (!session?.user) {
    return (
      <Link href="/signin" className="hidden md:block">
        <Button variant="ghost" size="sm">
          Sign in
        </Button>
      </Link>
    );
  }

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <Inline gap="0.375rem" align="center" className="hidden md:flex">
      <Link href="/dashboard">
        <Button variant="ghost" size="sm">
          <UserIcon className="mr-1 h-4 w-4" />
          {session.user.name || session.user.email}
        </Button>
      </Link>
      <Button variant="ghost" size="icon" onClick={handleSignOut} aria-label="Sign out">
        <LogOut className="h-4 w-4" />
      </Button>
    </Inline>
  );
}
