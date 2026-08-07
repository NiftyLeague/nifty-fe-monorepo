'use client'

import { useCallback, useState } from 'react'
import { Button } from '@nl/ui/base/button'
import { Checkbox } from '@nl/ui/base/checkbox'
import { DialogContent } from '@nl/ui/base/dialog'
import { Label } from '@nl/ui/base/label'
import type { Degen } from '@/types/degens'
import { DISABLE_RENT_API_URL } from '@/constants/url'
import { toast } from 'react-toastify'
import DegenImage from '@/components/cards/DegenCard/DegenImage'
import useAuth from '@/hooks/useAuth'

interface Props {
  degen?: Degen
  isEnabled?: boolean
  onClose: () => void
  onSuccess?: () => void
}

const EnableDisableDegenDialogContent = ({
  degen,
  isEnabled = false,
  onClose,
  onSuccess,
}: Props): React.ReactNode => {
  const { authToken } = useAuth()
  const [agreement, setAgreement] = useState(false)
  const handleButtonClick = useCallback(async () => {
    if (!authToken || !degen) {
      return
    }

    const headers = { authorizationToken: authToken }
    const res = await fetch(
      `${DISABLE_RENT_API_URL}${isEnabled ? 'deactivate' : 'activate'}?degen_id=${degen.id}`,
      {
        method: 'POST',
        headers,
      }
    )
    const json = await res.json()
    if (json.statusCode) {
      toast.error(json.body, { theme: 'dark' })
    } else {
      toast.success(`${isEnabled ? 'Disable' : 'Enable'} successfully!`, { theme: 'dark' })
      onSuccess?.()
      onClose()
    }
  }, [authToken, degen, isEnabled, onSuccess, onClose])

  return (
    <DialogContent showCloseButton={false} className="sm:max-w-[320px]">
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-center text-lg font-semibold">
          {isEnabled ? 'Disable' : 'Enable'} Degen #{degen?.id} Rentals
        </h2>
        {degen?.id && <DegenImage tokenId={degen.id} />}
        <p className="text-center text-xs text-muted-foreground">Owned by {degen?.owner}</p>
        {isEnabled ? (
          <p className="text-center text-sm text-foreground">
            Disabling your rental makes your rental queue private. Note that your queue will clear
            as existing rentals reach the already paid-for expiration. Re-enabling fee is 1000 NFTL.
          </p>
        ) : (
          <p className="text-center text-sm text-foreground">Enable Rental Fee 1000 NFTL</p>
        )}
      </div>
      <div className="flex items-center gap-2 pt-2">
        <Checkbox
          id="agreement-checkbox"
          checked={agreement}
          onCheckedChange={(checked) => setAgreement(!!checked)}
        />
        <Label htmlFor="agreement-checkbox" className="text-xs">
          I understand and agree the terms above.
        </Label>
      </div>
      <Button
        variant="default"
        className="mt-2 w-full"
        disabled={!agreement}
        onClick={handleButtonClick}
      >
        {isEnabled ? 'Disable' : 'Enable'} Degen #{degen?.id} Rentals
      </Button>
    </DialogContent>
  )
}

export default EnableDisableDegenDialogContent
