'use client'
import { useState } from 'react'
import { Button, Container, Link, Typography } from '@mui/material'
import { Dialog, DialogTrigger, DialogContent } from '@/components/dialog'

import styles from './WhitelistDialog.module.css'

export const WhitelistModal = (): React.ReactNode => {
  const [email, setEmail] = useState('')

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Need to integrate whitelist api here
    e.preventDefault()
  }

  return (
    <Container sx={{ textAlign: 'center', pt: { xs: 1, lg: 4 }, px: 0 }}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          name="email"
          type="email"
          value={email}
          placeholder="Enter your email"
          required
          aria-required="true"
          onChange={handleChangeEmail}
          className={styles.inputEmail}
        />
        <button type="submit" className={styles.submitButton}>
          Get Access
        </button>
      </form>
      <Typography variant="body1" sx={{ mt: 3.5 }}>
        Not into email? Follow on{' '}
        <Link
          href="https://twitter.com/NiftyLeague"
          target="_blank"
          rel="noreferrer"
          sx={{ cursor: 'pointer', textDecoration: 'none' }}
        >
          Twitter
        </Link>{' '}
        or{' '}
        <Link
          href="https://niftyleague.medium.com"
          target="_blank"
          rel="noreferrer"
          sx={{ cursor: 'pointer', textDecoration: 'none' }}
        >
          Medium
        </Link>
      </Typography>
    </Container>
  )
}

const WhitelistDialog = () => {
  const whitelistEnabled = false
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="outlined" fullWidth disabled>
          {whitelistEnabled ? 'Get Notified' : 'Play in Browser'}
        </Button>
      </DialogTrigger>
      <DialogContent
        aria-labelledby="exclusive-access-to-nifty-tennis"
        dialogTitle={`Get Notified When\nNifty Tennis Is Out!`}
        sx={{
          '& .MuiPaper-root': { maxWidth: 473 },
          '& h2': {
            fontSize: { xs: '22px', lg: '28px' },
            lineHeight: { xs: '28px', lg: '36px' },
            textAlign: 'center',
            paddingTop: '36px',
            whiteSpace: 'pre-line',
          },
          '& .MuiDialogContent-root': { border: 'none', paddingBottom: '36px' },
        }}
      >
        <WhitelistModal />
      </DialogContent>
    </Dialog>
  )
}

export default WhitelistDialog
