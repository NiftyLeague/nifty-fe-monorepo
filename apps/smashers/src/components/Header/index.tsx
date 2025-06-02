import Image from 'next/image';
import ActionButtonsGroup from './ActionButtonsGroup';
import Navbar from './Navbar';

import styles from './index.module.css';

type ActiveModal = 'credits' | 'play' | 'trailer' | 'unity' | null;

export default function Header({ openModal }: { openModal: (modal: ActiveModal) => void }) {
  return (
    <div className={styles.hero}>
      <div className="radial-gradient-bg-centered" />
      <div className={styles.heroContainer}>
        <Navbar />
        <div className={styles.heroContent}>
          <Image
            src="/img/logos/smashers/app_wordmark_logo.webp"
            alt="Wordmark Logo"
            className={styles.wordmark}
            width={824}
            height={572}
            priority
            sizes="(max-width: 768px) 100vw, 824px"
            quality={85}
          />
          <ActionButtonsGroup
            onPlayClick={() => openModal('play')}
            onTrailerClick={() => openModal('trailer')}
            onCreditsClick={() => openModal('credits')}
          />
        </div>
      </div>
    </div>
  );
}
