import SatoshiFrame from './satoshi-frame'
import SatoshiBurnAnim from './satoshi-burn-animations'
import type { JSX } from 'solid-js'

const SatoshiAnimations = (props: { burning: boolean; children?: JSX.Element }) => {
  const { burning } = props
  return (
    <>
      {burning ? (
        <SatoshiBurnAnim />
      ) : (
        <SatoshiFrame frames={['/img/comics/burner/idleanim.gif']} />
      )}
    </>
  )
}

const SatoshiAnimationsWithContext = ({ burning = false }) => {
  return <SatoshiAnimations burning={burning} />
}

SatoshiAnimations.displayName = 'SatoshiAnimations'
export default SatoshiAnimationsWithContext
