import { createSignal } from 'solid-js'

import { Button } from '@nl/ui/base/button'
import { Icon } from '@nl/ui/base/icon'
import { fetchJson } from '../../utils/fetchJson'
import { navigate, useUserSession } from '../../hooks/useUserSession'
import type { User } from '../../types'

export default function LogoutButton(props: { loading?: boolean }) {
  const [logout, setLogout] = createSignal(false)
  const { mutateUser } = useUserSession({ redirectTo: '/login' })

  const handleLogout = async (e: MouseEvent) => {
    setLogout(true)
    e.preventDefault()
    const res = await fetchJson<User>('/api/playfab/logout', { method: 'POST' })
    mutateUser(res)
    navigate('/login')
  }

  return (
    <div>
      <Button
        variant="muted"
        size="lg"
        className="w-full cursor-pointer disabled:cursor-not-allowed"
        disabled={props.loading || logout()}
        onClick={handleLogout}
      >
        <Icon name="log-out" />
        Sign Out
      </Button>
    </div>
  )
}
