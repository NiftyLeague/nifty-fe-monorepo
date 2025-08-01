'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@nl/ui/base/button';
import { Icon } from '@nl/ui/base/icon';
import { fetchJson } from '../../utils/fetchJson';
import { useUserSession } from '../../hooks/useUserSession';
import type { User } from '../../types';

export default function LogoutButton({ loading = false }) {
  const [logout, setLogout] = useState(false);
  const { mutateUser } = useUserSession({ redirectTo: '/login' });
  const router = useRouter();

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setLogout(true);
    e.preventDefault();
    const res = await fetchJson<User>('/api/playfab/logout', { method: 'POST' });
    mutateUser(res, { revalidate: true });
    router.push('/login');
  };

  return (
    <div>
      <Button
        variant="muted"
        size="lg"
        className="w-full cursor-pointer disabled:cursor-not-allowed"
        disabled={loading || logout}
        onClick={handleLogout}
      >
        <Icon name="log-out" />
        Sign Out
      </Button>
    </div>
  );
}
