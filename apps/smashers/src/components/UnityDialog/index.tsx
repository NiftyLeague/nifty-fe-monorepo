import dynamic from 'next/dynamic';
import { isOpera, browserName } from 'react-device-detect';
import { Dialog } from '@nl/ui/custom/dialog';
import { Title } from '@nl/ui/custom/typography';
import UnityButton from './UnityButton';

const Game = dynamic(() => import('./Game'), { ssr: false });

const UnityContent = ({ onClose }: { onClose: () => void }) => {
  return (
    <div>
      {isOpera ? (
        <Title level={2} style={{ textAlign: 'center', marginTop: 8, padding: '10rem 3rem' }}>
          {browserName} Browser Not Supported
        </Title>
      ) : (
        <Game closeGame={onClose} />
      )}
    </div>
  );
};

const UnityModal = () => {
  const onClose = () => {};

  return (
    <Dialog
      title="Play in Browser"
      description="Play Smashers in your browser or download the Windows version."
      hideDescription
      hideTitle
      triggerElement={<UnityButton />}
    >
      <UnityContent onClose={onClose} />
    </Dialog>
  );
};

export default UnityModal;
