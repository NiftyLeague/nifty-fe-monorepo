import { memo, useContext } from 'react';
import IMXContext, { Context } from '@/contexts/IMXContext';
import SatoshiFrame from './satoshi-frame';
import SatoshiBurnAnim from './satoshi-burn-animations';

const SatoshiAnimations: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<{ burning: boolean; imx: Context }>>
> = memo(({ burning, imx }) => {
  return <>{burning ? <SatoshiBurnAnim /> : <SatoshiFrame frames={['/img/comics/burner/idleanim.gif']} />}</>;
});

const SatoshiAnimationsWithContext = ({ burning = false }) => {
  const imx = useContext(IMXContext);
  return <SatoshiAnimations burning={burning} imx={imx} />;
};

SatoshiAnimations.displayName = 'SatoshiAnimations';
export default SatoshiAnimationsWithContext;
