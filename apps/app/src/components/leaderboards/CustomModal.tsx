'use client'

import { useState } from 'react'
import { useTheme, Theme } from '@nl/theme'
import { Box, Modal } from '@mui/material'

import styles from './CustomModal.module.css'

const style = (theme: Theme) => ({
  width: '67.5vh',
  height: '90vh',
  bgcolor: 'background.paper',
  border: '2px solid var(--color-background)',
  pt: 2,
  px: 4,
  pb: 3,
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  backgroundColor: '#181425',
  backgroundPosition: 'center',
  [theme.breakpoints.down('sm')]: {
    width: '90vw',
    height: '120vw',
    backgroundSize: 'cover',
    '& .title-header': { fontSize: '24px', top: '-28px' },
    '& .box-table': { marginTop: '18px' },
    '& p.MuiTypography-body2': { width: '100%', marginTop: '4px' },
  },
})
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
  const theme = useTheme()
  return (
    <>
      <div onClick={handleOpen}>{ModalIcon}</div>
      <Modal
        className={styles.styledModal}
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={open}
        onClose={handleClose}
      >
        <>
          <div className={styles.backdrop} />
          <Box
            sx={{
              ...style(theme),
              backgroundImage: `url(${
                flag === 'score'
                  ? '/img/leaderboards/wen_game.webp'
                  : flag === 'burnings'
                    ? '/img/leaderboards/mt_gawx.webp'
                    : '/img/leaderboards/nifty_smashers.webp'
              })`,
            }}
          >
            {child}
          </Box>
        </>
      </Modal>
    </>
  )
}
export default CustomModal
