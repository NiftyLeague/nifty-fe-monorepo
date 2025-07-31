'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Text, Title } from '@nl/ui/custom/Typography';
import useVersion from '@/hooks/useVersion';
import Modal from '@/components/Modal';
import styles from '@/components/Modal/index.module.css';
// import UnityButton from './UnityButton';

const ModalContent = ({ launchGame }: { launchGame: () => void }) => {
  const { message } = useVersion();

  return (
    <div className="grid gap-4 w-[800px] max-w-screen px-10 py-8">
      <div className="grid auto-cols-max grid-flow-col gap-4 items-center">
        <Image
          src="/img/logos/NL/white.webp"
          alt="Company Logo"
          width={50}
          height={48}
          priority
          style={{ maxWidth: '100%', height: 'auto' }}
        />
        <Title level={2}>Let&apos;s Brawl!</Title>
      </div>
      <Text variant="muted" sm>
        {message}
      </Text>
      <Text>
        This party platform fighter will have you on the edge of your seat as you and three other players grab your
        bats, unleash unique abilities, and try to smash each other out of the arena in a winner-takes-all battle!
      </Text>
      <div className="grid grid-cols-3 gap-2 items-center">
        <Link
          href="/android/&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1"
          target="_blank"
          rel="noreferrer"
          className="w-full justify-items-center"
        >
          <Image
            src="/img/badges/google-play-badge.webp"
            alt="Get it on Google Play"
            width={234}
            height={70}
            priority
            style={{ width: '100%', maxWidth: '100%', height: 'auto' }}
          />
        </Link>
        <Link href="/ios" target="_blank" rel="noreferrer" className="w-full justify-items-center">
          <Image
            src="/img/badges/apple-store-badge.svg"
            alt="Apple Store Badge"
            width={215}
            height={72}
            priority
            style={{ width: '92%', maxWidth: '100%', height: 'auto' }}
          />
        </Link>
        <Link href="/steam" target="_blank" rel="noreferrer" className="w-full justify-items-center">
          <Image
            src="/img/badges/steam-badge.webp"
            alt="Steam Store Badge"
            width={234}
            height={69}
            priority
            style={{ width: '100%', maxWidth: '100%', height: 'auto' }}
          />
        </Link>
        {/* <UnityButton launchGame={launchGame} /> */}
      </div>
    </div>
  );
};

type PlayModalProps = { isOpen: boolean; onClose: () => void; launchGame: () => void };

const PlayModal = ({ isOpen, onClose, launchGame }: PlayModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} contentClassName={styles.modal_paper_dark}>
      <ModalContent launchGame={launchGame} />
    </Modal>
  );
};

export default PlayModal;
