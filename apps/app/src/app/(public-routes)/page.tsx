import GameList from './games/_GameList'
import DeferredWeb3GameList from './games/DeferredWeb3GameList'
import StaticSection from '@/components/sections/StaticSection'

const Home = () => {
  return (
    <>
      <StaticSection firstSection title="Free-2-Play Games">
        <div className="grid grid-cols-12 gap-y-8 pb-8 sm:gap-y-0 sm:pb-4 md:pb-0">
          <GameList />
        </div>
      </StaticSection>
      <StaticSection firstSection title="Web3 Games">
        <div className="grid grid-cols-12 gap-y-8 pb-8 sm:gap-y-0 sm:pb-4 md:pb-0">
          <DeferredWeb3GameList />
        </div>
      </StaticSection>
    </>
  )
}

export default Home
