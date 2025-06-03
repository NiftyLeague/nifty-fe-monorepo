import Image from 'next/image';
import styles from './index.module.css';

type ActionButtonsGroupProps = { onPlayClick: () => void; onTrailerClick: () => void; onCreditsClick: () => void };

export default function ActionButtonsGroup({ onPlayClick, onTrailerClick, onCreditsClick }: ActionButtonsGroupProps) {
  return (
    <div className={styles.heroBtnGroup}>
      <button onClick={onTrailerClick}>
        <Image
          src="/icons/socials/youtube.svg"
          alt="YouTube Logo"
          width={22}
          height={22}
          style={{ maxWidth: '100%', height: 'auto' }}
        />
        Trailer
      </button>
      <button onClick={onPlayClick}>
        <Image
          src="/icons/controller.svg"
          alt="Game Icon"
          width={22}
          height={22}
          style={{ maxWidth: '100%', height: 'auto' }}
        />
        Play
      </button>
      <button onClick={onCreditsClick}>
        <Image
          src="/icons/credits.svg"
          alt="Credits Icon"
          width={22}
          height={22}
          style={{ maxWidth: '100%', height: 'auto' }}
        />
        Credits
      </button>
    </div>
  );
}
