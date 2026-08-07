'use client'

import DegenImage from '@/components/cards/DegenCard/DegenImage'
import ProgressBar from '@/components/wrapper/ProgressBar'
import { Button } from '@nl/ui/base/button'
import { Dialog, DialogContent } from '@nl/ui/base/dialog'
import { useState } from 'react'
import Countdown from 'react-countdown'
import { useRouter } from 'next/navigation'
import type { Rentals } from '@/types/rentals'
import useLocalStorage from '@/hooks/useLocalStorage'

interface ActiveRentalDialogProps {
  degenId: string | number
  rental: Rentals
}

const ActiveRentalDialog = ({ degenId, rental }: ActiveRentalDialogProps) => {
  const router = useRouter()
  const progressValue = (100 / rental.earning_cap) * rental.earning_cap_daily
  const [activeRental] = useLocalStorage<boolean>('active_rental', false)
  const [isOpen, setIsOpen] = useState<boolean>(activeRental ? false : true)

  const handleClickRental = () => {
    router.push('/dashboard/rentals')
  }

  const handleClickPlay = () => {
    router.push('/games/smashers')
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && setIsOpen(false)}>
      <DialogContent className="my-[50px] mx-4">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-6">
            <span className="text-[32px] leading-[38px] font-semibold">Welcome back DEGEN!</span>
            <span className="mt-6 mb-[30px] block text-base leading-5 font-bold">
              Your active{' '}
              <button
                type="button"
                onClick={handleClickRental}
                className="cursor-pointer text-blue hover:underline"
              >
                rental
              </button>{' '}
              is at {progressValue.toFixed(2)}% of it’s earning cap. Earn more NFTL when you play
              NOW.
            </span>
            <Button variant="default" onClick={handleClickPlay}>
              Play Nifty Smashers Now
            </Button>
          </div>
          <div className="col-span-12 lg:col-span-6">
            <div className="float-right inline-block w-[70%]">
              <ProgressBar value={progressValue}>
                {rental.earning_cap !== rental.earning_cap_daily ? (
                  `${rental.earning_cap_daily} / ${rental.earning_cap}`
                ) : (
                  <span className="text-[10px]">
                    LIMIT REACHED. RENEWS IN{' '}
                    <span className="text-[10px] text-warning">
                      <Countdown date={new Date(rental.next_charge_at * 1000)} />
                    </span>
                  </span>
                )}
              </ProgressBar>
            </div>
            <div className="mt-3.5 flex flex-col items-end">
              <DegenImage
                sx={{
                  width: '174px',
                  height: 'auto',
                  marginTop: '16px',
                  borderRadius: 'var(--radius-default)',
                }}
                tokenId={degenId}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ActiveRentalDialog
