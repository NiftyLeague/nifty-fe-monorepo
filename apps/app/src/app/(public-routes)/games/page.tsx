import GameList from './_GameList'
import Web3GameList from './_Web3GameList'
import DeferredInstallerAction from './DeferredInstallerAction'
import StaticSection from '@/components/sections/StaticSection'

const GamesPage = () => {
  return (
    <>
      <StaticSection firstSection title="Free-2-Play Games">
        <div className="grid grid-cols-12 gap-y-8 pb-8 sm:gap-y-0 sm:pb-4 md:pb-0">
          <GameList />
        </div>
      </StaticSection>
      <StaticSection firstSection title="Web3 Games" actions={<DeferredInstallerAction />}>
        <div className="grid grid-cols-12 gap-y-8 pb-8 sm:gap-y-0 sm:pb-4 md:pb-0">
          <Web3GameList />
        </div>
      </StaticSection>
    </>
  )
}

export default GamesPage
