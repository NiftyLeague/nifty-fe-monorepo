import cn from 'classnames';
import dynamic from 'next/dynamic';
import { isOpera, browserName } from 'react-device-detect';
import { Typography } from '@nl/ui/supabase';
import styles from '@/styles/modal.module.css';

const Game = dynamic(() => import('./Game'), { ssr: false });

type UnityModalProps = { closeGame: () => void; gameOpen: boolean };

const UnityModal = ({ closeGame, gameOpen }: UnityModalProps) => {
  return (
    <div id="unity-modal" className={cn(styles.modal, { hidden: !gameOpen })}>
      <div className={styles.modal_paper_dark}>
        {isOpera ? (
          <Typography.Title level={2} style={{ textAlign: 'center', marginTop: 8, padding: '10rem 3rem' }}>
            {browserName} Browser Not Supported
          </Typography.Title>
        ) : (
          <>{gameOpen && <Game closeGame={closeGame} />}</>
        )}
      </div>
      <div id="unity-close-icon" className={styles.close_icon}>
        &times;
      </div>
    </div>
  );
};

export default UnityModal;
