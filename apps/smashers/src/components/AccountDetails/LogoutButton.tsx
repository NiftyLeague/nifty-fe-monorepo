import cn from 'classnames';
import { IconLogOut } from '@nl/ui/supabase';
import { useUserSession } from '@/lib/playfab/hooks';
import { fetchJson } from '@/lib/playfab/utils';

import styles from '@/styles/profile.module.css';

export default function LogoutButton({ loading = false }) {
  const { mutateUser } = useUserSession({ redirectTo: '/login' });
  return (
    <div>
      <button
        className={cn(styles.button_secondary, 'block')}
        style={{ marginBottom: 0 }}
        disabled={loading}
        onClick={async e => {
          e.preventDefault();
          mutateUser(await fetchJson('/api/playfab/logout', { method: 'POST' }));
        }}
      >
        <IconLogOut />
        Sign Out
      </button>
    </div>
  );
}
