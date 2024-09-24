import { memo } from 'react';
import SatoshiFrame from './satoshi-frame';
import SatoshiBurnAnim from './satoshi-burn-animations';

const SatoshiAnimations: React.FC<React.PropsWithChildren<React.PropsWithChildren<{ burning: boolean }>>> = memo(
  ({ burning }) => {
    return <>{burning ? <SatoshiBurnAnim /> : <SatoshiFrame frames={['/img/comics/burner/idleanim.gif']} />}</>;
  },
);

const SatoshiAnimationsWithContext = ({ burning = false }) => {
  return <SatoshiAnimations burning={burning} />;
};

SatoshiAnimations.displayName = 'SatoshiAnimations';
export default SatoshiAnimationsWithContext;
