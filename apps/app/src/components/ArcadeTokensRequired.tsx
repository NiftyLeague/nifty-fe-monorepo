'use client'

import { useState } from 'react'
import { Button } from '@nl/ui/base/button'
import { Title } from '@nl/ui/custom/typography'
import BuyArcadeTokensDialog from '@/components/dialog/BuyArcadeTokensDialog'

const gridSpacing = 3 // 24px

interface ArcadeTokensRequiredProps {
  refetchArcadeBal: () => void
}

const ArcadeTokensRequired: React.FC<ArcadeTokensRequiredProps> = ({ refetchArcadeBal }) => {
  const [openBuyAT, setOpenBuyAT] = useState(false)

  const handleBuyArcadeTokens = () => {
    // TODO: Integrate Buy Arcade Tokens here
    setOpenBuyAT(true)
  }

  return (
    <>
      <div className="grid h-full grid-cols-12 items-center" style={{ gap: gridSpacing * 8 }}>
        <div className="col-span-12">
          <div className="grid grid-cols-12" style={{ gap: gridSpacing * 8 }}>
            <div className="col-span-12">
              <Title level={1} className="text-center">
                Arcade Tokens Required
              </Title>
            </div>
            <div className="col-span-12 text-center">
              <Button variant="outline" onClick={handleBuyArcadeTokens}>
                Buy Arcade Tokens
              </Button>
            </div>
          </div>
        </div>
      </div>
      <BuyArcadeTokensDialog
        open={openBuyAT}
        onSuccess={() => {
          setOpenBuyAT(false)
          refetchArcadeBal()
        }}
        onClose={() => setOpenBuyAT(false)}
      />
    </>
  )
}

export default ArcadeTokensRequired
