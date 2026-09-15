import { toast } from 'solid-sonner'

import { Button } from '@nl/ui/base/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@nl/ui/base/alert-dialog'
import { Icon } from '@nl/ui/base/icon'

import { fetchJson } from '../../utils/fetchJson'
import { errorMsgHandler } from '../../utils/errorHandlers'
import { navigate, useUserSession } from '../../hooks/useUserSession'

export default function DeleteAccountDialog(props: { loading?: boolean }) {
  const { mutateUser } = useUserSession({ redirectTo: '/login' })

  const handleDeleteUser = async () => {
    try {
      mutateUser(
        await fetchJson('/api/playfab/user/delete-account', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      )
      navigate('/login')
      toast.success('Delete Account Success!')
    } catch (e) {
      const msg = errorMsgHandler(e)
      toast.error(msg)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger
        as={Button}
        variant="destructive"
        size="lg"
        className="w-full cursor-pointer disabled:cursor-not-allowed"
        disabled={props.loading}
      >
        <Icon name="trash" />
        Delete Account
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Account</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure? This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline" className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleDeleteUser}
            className="cursor-pointer"
          >
            Delete Account
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
