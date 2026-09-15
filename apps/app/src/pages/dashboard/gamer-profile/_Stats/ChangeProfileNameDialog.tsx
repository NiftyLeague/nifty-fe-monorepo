'use client'

import { useContext } from 'solid-js'

import DeferredComponent from '@nl/ui/custom/deferred-component'
import { Button } from '@nl/ui/base/button'
import { Pencil } from 'lucide-react'
import { Dialog, DialogContext, DialogTrigger, DialogContent } from '@/components/dialog'
import DeferredDialogLoading from '@/components/providers/DeferredDialogLoading'

interface ChangeProfileNameDialogProps {
  handleUpdateNewName: (newName: string) => void
}

const loadChangeProfileNameForm = () => import('./ChangeProfileNameForm')

function DeferredChangeProfileNameForm({
  handleUpdateNewName,
}: ChangeProfileNameDialogProps): JSX.Element {
  const [open] = useContext(DialogContext)

  return (
    <DeferredComponent
      enabled={open}
      label="profile name form"
      load={loadChangeProfileNameForm}
      loadingFallback={<DeferredDialogLoading label="Loading profile name form" />}
      props={{ updateNewName: handleUpdateNewName }}
    />
  )
}

const ChangeProfileNameDialog = ({
  handleUpdateNewName,
}: ChangeProfileNameDialogProps): JSX.Element => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="ghost" size="icon" aria-label="edit" class="cursor-pointer">
          <Pencil aria-hidden="true" absoluteStrokeWidth size={20} stroke-width={1.5} />
        </Button>
      </DialogTrigger>
      <DialogContent dialogTitle="Update your username" sx={{ width: '300px' }}>
        <DeferredChangeProfileNameForm handleUpdateNewName={handleUpdateNewName} />
      </DialogContent>
    </Dialog>
  )
}

export default ChangeProfileNameDialog
