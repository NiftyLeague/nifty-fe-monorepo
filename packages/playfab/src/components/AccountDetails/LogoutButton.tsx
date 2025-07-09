'use client';

import Button from '@nl/ui/supabase/Button';
import Icon from '@nl/ui/base/Icon';
import useUserSession from '../../hooks/useUserSession';
import fetchJson from '../../utils/fetchJson';

import styles from '../../styles/profile.module.css';

export default function LogoutButton({ loading = false }) {
  const { mutateUser } = useUserSession({ redirectTo: '/login' });
  return (
    <div>
      <Button
        block
        className={styles.button_secondary}
        disabled={loading}
        icon={<Icon name="log-out" />}
        size="md"
        type="default"
        onClick={async e => {
          e.preventDefault();
          mutateUser(await fetchJson('/api/playfab/logout', { method: 'POST' }));
        }}
      >
        Sign Out
      </Button>
    </div>
  );
}
