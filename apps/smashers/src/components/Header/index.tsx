import Image from 'next/image';
import ActionButtonsGroup from './ActionButtonsGroup';
import Navbar from './Navbar';

import styles from './index.module.css';

type ActiveModal = 'credits' | 'play' | 'trailer' | 'unity' | null;

const Header = ({ activeModal }: { activeModal: ActiveModal }) => (
  <div className={styles.hero}>
    <div className="dark-gradient-overlay !h-screen" />
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
        <ActionButtonsGroup activeModal={activeModal} />
      </div>
    </div>
  </div>
);

export default Header;
