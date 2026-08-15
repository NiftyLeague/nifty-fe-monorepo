'use client'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@nl/ui/base/dialog'

import styles from './CustomModal.module.css'

const backgroundImage = (flag: string | undefined) =>
  flag === 'score'
    ? '/img/leaderboards/wen_game.webp'
    : flag === 'burnings'
      ? '/img/leaderboards/mt_gawx.webp'
      : '/img/leaderboards/nifty_smashers.webp'

interface ModalProps {
  child: React.ReactNode
  flag?: string
  onOpenChange: (open: boolean) => void
  open: boolean
}
const CustomModal = (props: ModalProps): React.ReactNode | null => {
  const { child, flag, onOpenChange, open } = props
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className={styles.styledModal}>
        <DialogTitle className="sr-only">Your leaderboard rank</DialogTitle>
        <DialogDescription className="sr-only">
          Your rank and nearby leaderboard scores.
        </DialogDescription>
        <DialogClose className="sr-only">Close leaderboard rank</DialogClose>
        <div className={styles.backdrop} />
        <div
          className="relative mx-auto border-2 border-[var(--color-background)] bg-[#181425] bg-contain bg-center bg-no-repeat max-sm:!h-[120vw] max-sm:!w-[90vw] max-sm:!bg-cover"
          style={{
            width: '67.5vh',
            height: '90vh',
            paddingTop: 16,
            paddingLeft: 32,
            paddingRight: 32,
            paddingBottom: 24,
            backgroundImage: `url(${backgroundImage(flag)})`,
          }}
        >
          {child}
        </div>
      </DialogContent>
    </Dialog>
  )
}
export default CustomModal
