import { memo } from 'react';

import SatoshiFrame from './satoshi-frame';

const SatoshiBurnAnimations: React.FC = memo(() => {
  return <SatoshiFrame frames={['/images/comics/burner/burning-animations/burnanim.gif']} />;
});

SatoshiBurnAnimations.displayName = 'SatoshiBurnAnimations';
export default SatoshiBurnAnimations;
