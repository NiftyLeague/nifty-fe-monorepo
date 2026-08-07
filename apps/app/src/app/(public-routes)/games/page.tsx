'use client'

import Link from 'next/link'
import { Button } from '@nl/ui/base/button'
import SectionSlider from '@/components/sections/SectionSlider'
import useVersion from '@/hooks/useVersion'
import GameList from './_GameList'
import Web3GameList from './_Web3GameList'

const GamesPage = () => {
  const { isWindows, isMacOs, downloadURL, version, message } = useVersion()
  const installerDisabled = isMacOs || !version
  return (
    <>
      <SectionSlider firstSection title="Free-2-Play Games" isSlider={false}>
        <div className="grid grid-cols-12 gap-y-8 pb-8 sm:gap-y-0 sm:pb-4 md:pb-0">
          <GameList />
        </div>
      </SectionSlider>
      <SectionSlider
        firstSection
        title="Web3 Games"
        isSlider={false}
        actions={
          installerDisabled ? (
            <Button variant="outline" disabled>
              {!version && isWindows ? 'Fetching installer version...' : message}
            </Button>
          ) : (
            <Button asChild variant="outline">
              <Link href={downloadURL}>{message}</Link>
            </Button>
          )
        }
      >
        <div className="grid grid-cols-12 gap-y-8 pb-8 sm:gap-y-0 sm:pb-4 md:pb-0">
          <Web3GameList />
        </div>
      </SectionSlider>
    </>
  )
}

export default GamesPage
