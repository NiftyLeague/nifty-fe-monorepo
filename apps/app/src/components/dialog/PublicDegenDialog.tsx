'use client'

import { Button } from '@nl/ui/base/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@nl/ui/base/dialog'
import DegenModalMedia from '@/components/dialog/DegenDialog/DegenModalMedia'
import { DEGEN_PURCHASE_URL } from '@/constants/public-urls'
import type { PublicDegen } from '@/types/degens'
import { getDegenTraitEntries } from '@/utils/degen-traits'

interface PublicDegenDialogProps {
  open: boolean
  degen?: Pick<PublicDegen, 'id' | 'name' | 'owner' | 'traits_string'>
  onClose: () => void
}

export default function PublicDegenDialog({ open, degen, onClose }: PublicDegenDialogProps) {
  const traits = getDegenTraitEntries(degen?.traits_string)

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent class="w-[calc(100%-2rem)] !max-w-[900px] overflow-x-hidden">
        <div class="grid min-w-0 grid-cols-1 gap-6 md:grid-cols-2">
          <div class="flex min-w-0 flex-col items-center gap-4">
            {degen?.id && <DegenModalMedia tokenId={degen.id} />}
            <DialogHeader class="items-center">
              <DialogTitle>{degen?.name || 'No Name DEGEN'}</DialogTitle>
              <DialogDescription>Degen #{degen?.id}</DialogDescription>
              {degen?.id && (
                <a
                  href={DEGEN_PURCHASE_URL(degen.id)}
                  target="_blank"
                  rel="noreferrer"
                  class="text-sm text-muted-foreground underline underline-offset-4"
                >
                  View on OpenSea
                </a>
              )}
              {degen?.owner && (
                <p class="text-sm text-muted-foreground">
                  Owned by {`${degen.owner.slice(0, 5)}...${degen.owner.slice(-4)}`}
                </p>
              )}
            </DialogHeader>
          </div>
          <div class="flex min-w-0 flex-col gap-6">
            <div>
              <h2 class="text-xl font-semibold">Degen Traits</h2>
              {traits.length ? (
                <ul class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {traits.map((trait) => (
                    <li
                      class="flex min-w-0 flex-col rounded-md border px-3 py-2 text-center text-sm"
                    >
                      {trait.name && <span class="font-semibold">{trait.name}</span>}
                      <span class="break-words">{trait.value}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p class="mt-6 text-sm text-muted-foreground">Trait data unavailable.</p>
              )}
            </div>
            <Button class="w-full" onClick={onClose} autoFocus aria-label="Close degen details">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
