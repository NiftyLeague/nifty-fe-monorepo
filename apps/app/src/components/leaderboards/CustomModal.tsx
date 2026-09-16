import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@nl/ui/base/dialog'

import styles from './CustomModal.module.css'
import type { JSX } from 'solid-js'

const backgroundImage = (flag: string | undefined) =>
  flag === 'score'
    ? '/img/leaderboards/wen_game.webp'
    : flag === 'burnings'
      ? '/img/leaderboards/mt_gawx.webp'
      : '/img/leaderboards/nifty_smashers.webp'

interface ModalProps {
  child: JSX.Element
  flag?: string
  onOpenChange: (open: boolean) => void
  open: boolean
}
const CustomModal = (props: ModalProps): JSX.Element | null => {
  const { child, flag, onOpenChange, open } = props
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} class={styles.styledModal}>
        <DialogTitle class="sr-only">Your leaderboard rank</DialogTitle>
        <DialogDescription class="sr-only">
          Your rank and nearby leaderboard scores.
        </DialogDescription>
        <DialogClose class="sr-only">Close leaderboard rank</DialogClose>
        <div class={styles.backdrop} />
        <div
          class="relative mx-auto w-168.75 h-225 pt-4 px-8 pb-6 border-2 border-background bg-(--scrim) bg-(--modal-bg) bg-contain bg-center bg-no-repeat max-sm:!h-(--lb-modal-h) max-sm:!w-(--lb-modal-w) max-sm:!bg-cover"
          style={{ '--modal-bg': `url(${backgroundImage(flag)})` }}
        >
          {child}
        </div>
      </DialogContent>
    </Dialog>
  )
}
export default CustomModal
