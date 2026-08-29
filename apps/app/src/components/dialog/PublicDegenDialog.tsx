'use client'

import { useMemo } from 'react'
import { Button } from '@nl/ui/base/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@nl/ui/base/dialog'
import DegenImage from '@/components/cards/DegenCard/DegenImage'
import { getTraitDisplay } from '@/constants/cosmeticsFilters'
import { DEGEN_PURCHASE_URL } from '@/constants/public-urls'
import type { PublicDegen } from '@/types/degens'

interface DisplayTrait {
  key: string
  name?: string
  value: string
}

interface PublicDegenDialogProps {
  open: boolean
  degen?: Pick<PublicDegen, 'id' | 'name' | 'owner' | 'traits_string'>
  onClose: () => void
}

export default function PublicDegenDialog({ open, degen, onClose }: PublicDegenDialogProps) {
  const traits = useMemo(
    () =>
      degen?.traits_string
        ?.split(',')
        .map((trait, index): DisplayTrait | null => {
          const trimmedTrait = trait.trim()
          if (!trimmedTrait) return null

          if (!/^\d+$/.test(trimmedTrait)) {
            return { key: `${index}-${trimmedTrait}`, value: trimmedTrait }
          }

          // The API keeps empty contract slots as zeroes. They are not
          // attributes and should not become numeric cards in the modal.
          if (/^0+$/.test(trimmedTrait)) return null

          const display = getTraitDisplay(trimmedTrait, index)

          return {
            key: `${index}-${trimmedTrait}`,
            ...display,
          }
        })
        .filter((trait): trait is DisplayTrait => trait !== null) ?? [],
    [degen?.traits_string]
  )

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="!max-w-[900px] overflow-x-hidden">
        <div className="grid min-w-0 grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex min-w-0 flex-col items-center gap-4">
            {degen?.id && (
              <div className="w-full max-w-[500px] min-w-0 overflow-hidden">
                <DegenImage
                  tokenId={degen.id}
                  sx={{
                    display: 'block',
                    width: '100%',
                    maxWidth: '100%',
                    height: 'auto',
                    objectFit: 'contain',
                  }}
                />
              </div>
            )}
            <DialogHeader className="items-center">
              <DialogTitle>{degen?.name || 'No Name DEGEN'}</DialogTitle>
              <DialogDescription>Degen #{degen?.id}</DialogDescription>
              {degen?.id && (
                <a
                  href={DEGEN_PURCHASE_URL(degen.id)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-muted-foreground underline underline-offset-4"
                >
                  View on OpenSea
                </a>
              )}
              {degen?.owner && (
                <p className="text-sm text-muted-foreground">
                  Owned by {`${degen.owner.slice(0, 5)}...${degen.owner.slice(-4)}`}
                </p>
              )}
            </DialogHeader>
          </div>
          <div className="flex min-w-0 flex-col gap-6">
            <div>
              <h2 className="text-xl font-semibold">Degen Traits</h2>
              {traits.length ? (
                <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {traits.map((trait) => (
                    <li
                      key={trait.key}
                      className="flex min-w-0 flex-col rounded-md border px-3 py-2 text-center text-sm"
                    >
                      {trait.name && <span className="font-semibold">{trait.name}</span>}
                      <span className="break-words">{trait.value}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-6 text-sm text-muted-foreground">Trait data unavailable.</p>
              )}
            </div>
            <Button className="w-full" onClick={onClose} autoFocus aria-label="Close degen details">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
