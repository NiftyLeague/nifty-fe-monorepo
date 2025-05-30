import dynamic from 'next/dynamic';
import { isOpera, browserName } from 'react-device-detect';
import { Typography } from '@nl/ui/supabase';
import styles from '@/styles/modal.module.css';
import Modal from '@/components/Modal';

const Game = dynamic(() => import('./Game'), { ssr: false });

const UnityContent = ({ onClose }: { onClose: () => void }) => {
  return (
    <div>
      {isOpera ? (
        <Typography.Title level={2} style={{ textAlign: 'center', marginTop: 8, padding: '10rem 3rem' }}>
          {browserName} Browser Not Supported
        </Typography.Title>
      ) : (
        <Game closeGame={onClose} />
      )}
    </div>
  );
};

type UnityModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const UnityModal = ({ isOpen, onClose }: UnityModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} contentClassName={styles.modal_paper_dark}>
      <UnityContent onClose={onClose} />
    </Modal>
  );
};

export default UnityModal;
