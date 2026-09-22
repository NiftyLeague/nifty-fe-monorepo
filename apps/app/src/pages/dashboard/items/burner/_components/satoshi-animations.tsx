import SatoshiFrame from './satoshi-frame'
import SatoshiBurnAnim from './satoshi-burn-animations'
import { Show } from 'solid-js'
import type { JSX } from 'solid-js'

const SatoshiAnimations = (props: { burning: boolean; children?: JSX.Element }) => {
  return (
    <Show
      when={props.burning}
      fallback={
        <SatoshiFrame
          frames={['https://cdn.niftyleague.com/media/img/comics/burner/idleanim.gif']}
        />
      }
    >
      <SatoshiBurnAnim />
    </Show>
  )
}

const SatoshiAnimationsWithContext = (props: { burning?: boolean }) => {
  return <SatoshiAnimations burning={props.burning ?? false} />
}

SatoshiAnimations.displayName = 'SatoshiAnimations'
export default SatoshiAnimationsWithContext
