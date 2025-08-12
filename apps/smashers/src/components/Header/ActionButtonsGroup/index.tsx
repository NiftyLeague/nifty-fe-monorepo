import dynamic from 'next/dynamic';
import styles from './index.module.css';

// Lazy load dialogs
const CreditsDialog = dynamic(() => import('@/components/CreditsDialog'), { ssr: false, loading: () => null });
const PlayDialog = dynamic(() => import('@/components/PlayDialog'), { ssr: false, loading: () => null });
const TrailerDialog = dynamic(() => import('@/components/TrailerDialog'), { ssr: false, loading: () => null });

type ActiveModal = 'credits' | 'play' | 'trailer' | 'unity' | null;

const ActionButtonsGroup = ({ activeModal }: { activeModal: ActiveModal }) => (
  <div className={styles.heroBtnGroup}>
    <TrailerDialog open={activeModal === 'trailer'} />
    <PlayDialog open={activeModal === 'play'} />
    <CreditsDialog open={activeModal === 'credits'} />
  </div>
);

export default ActionButtonsGroup;
