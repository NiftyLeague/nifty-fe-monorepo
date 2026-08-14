import GameList from './games/_GameList'
import Web3GameList from './games/_Web3GameList'
import StaticSection from '@/components/sections/StaticSection'
import PublicContentContainer from '@/components/wrapper/PublicContentContainer'

const Home = () => {
  return (
    <PublicContentContainer>
      <StaticSection firstSection title="Free-2-Play Games">
        <div className="grid grid-cols-12 gap-y-8 pb-8 sm:gap-y-0 sm:pb-4 md:pb-0">
          <GameList />
        </div>
      </StaticSection>
      <StaticSection firstSection title="Web3 Games">
        <div className="grid grid-cols-12 gap-y-8 pb-8 sm:gap-y-0 sm:pb-4 md:pb-0">
          <Web3GameList />
        </div>
      </StaticSection>
    </PublicContentContainer>
  )
}

export default Home
