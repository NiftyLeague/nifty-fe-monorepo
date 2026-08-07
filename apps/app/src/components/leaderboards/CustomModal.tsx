'use client'

import { useState } from 'react'

import { Dialog, DialogContent } from '@nl/ui/base/dialog'

import styles from './CustomModal.module.css'

const backgroundImage = (flag: string | undefined) =>
  flag === 'score'
    ? '/img/leaderboards/wen_game.webp'
    : flag === 'burnings'
      ? '/img/leaderboards/mt_gawx.webp'
      : '/img/leaderboards/nifty_smashers.webp'

interface ModalProps {
  ModalIcon: React.ReactNode
  child: React.ReactNode
  flag?: string
}
const CustomModal = (props: ModalProps): React.ReactNode | null => {
  const { ModalIcon, child, flag } = props
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  return (
    <>
      <div onClick={handleOpen}>{ModalIcon}</div>
      <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
        <DialogContent showCloseButton={false} className={styles.styledModal}>
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
    </>
  )
}
export default CustomModal
