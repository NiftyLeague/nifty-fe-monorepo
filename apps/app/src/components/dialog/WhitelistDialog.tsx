'use client'
import { useState } from 'react'
import { Button } from '@nl/ui/base/button'
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
    <div className="container px-0 pt-1 text-center lg:pt-4">
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
      <span className="mt-7 block text-base">
        Not into email? Follow on{' '}
        <a
          href="https://twitter.com/NiftyLeague"
          target="_blank"
          rel="noreferrer"
          className="cursor-pointer text-blue no-underline hover:underline"
        >
          Twitter
        </a>{' '}
        or{' '}
        <a
          href="https://niftyleague.medium.com"
          target="_blank"
          rel="noreferrer"
          className="cursor-pointer text-blue no-underline hover:underline"
        >
          Medium
        </a>
      </span>
    </div>
  )
}

const WhitelistDialog = () => {
  const whitelistEnabled = false
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline" className="w-full" disabled>
          {whitelistEnabled ? 'Get Notified' : 'Play in Browser'}
        </Button>
      </DialogTrigger>
      <DialogContent
        aria-labelledby="exclusive-access-to-nifty-tennis"
        dialogTitle={
          <span className="block pt-9 text-center text-[22px] leading-[28px] whitespace-pre-line lg:text-[28px] lg:leading-[36px]">
            {`Get Notified When\nNifty Tennis Is Out!`}
          </span>
        }
      >
        <WhitelistModal />
      </DialogContent>
    </Dialog>
  )
}

export default WhitelistDialog
