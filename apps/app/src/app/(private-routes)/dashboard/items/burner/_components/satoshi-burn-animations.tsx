import { memo } from 'react';

import SatoshiFrame from './satoshi-frame';

const SatoshiBurnAnimations: React.FC = memo(() => {
  return <SatoshiFrame frames={['/img/comics/burner/burnanim.gif']} />;
});

SatoshiBurnAnimations.displayName = 'SatoshiBurnAnimations';
export default SatoshiBurnAnimations;
