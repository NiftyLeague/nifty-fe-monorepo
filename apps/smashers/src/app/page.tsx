'use client';

import { use, useState, useEffect } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';

import Navbar from '@/components/Navbar';
import ConsoleGame from '@/components/ConsoleGame';
import GameSection from '@/components/GameSection';
import DegensSection from '@/components/DegensSection';
import Footer from '@/components/Footer';
import ActionButtonsGroup from '@/components/ActionButtonsGroup';
import styles from '@/styles/smashers.module.css';

const CreditsModal = dynamic(() => import('@/components/CreditsModal'), { ssr: false });
const PlayModal = dynamic(() => import('@/components/PlayModal'), { ssr: false });
const TrailerModal = dynamic(() => import('@/components/TrailerModal'), { ssr: false });
const UnityModal = dynamic(() => import('@/components/UnityModal'), { ssr: false });

type NextSearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

type ActiveModal = 'credits' | 'play' | 'trailer' | 'unity' | null;

export default function Home({ searchParams }: { searchParams: NextSearchParams }) {
  // Modal state management
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const openModal = (modal: ActiveModal) => setActiveModal(modal);
  const closeModal = () => setActiveModal(null);

  // Handle referral link
  const { referral } = use(searchParams);
  useEffect(() => {
    if (referral) openModal('play');
  }, [referral]);

  return (
    <>
      <section className={styles.main}>
        <div className="radial-gradient-bg-centered" />
        <div className={styles.container}>
          <Navbar />
          <div className={styles.content}>
            <Image
              src="/img/logos/smashers/app_wordmark_logo.webp"
              alt="Wordmark Logo"
              className={styles.wordmark}
              width={824}
              height={572}
              priority
            />
            <ActionButtonsGroup
              onPlayClick={() => openModal('play')}
              onTrailerClick={() => openModal('trailer')}
              onCreditsClick={() => openModal('credits')}
            />
          </div>
        </div>
      </section>
      <section className={styles.console_game}>
        <ConsoleGame src="/video/smashers-960p.mp4" />
      </section>
      <section className={styles.game_details}>
        <GameSection />
      </section>
      <section className={styles.character_details}>
        <DegensSection />
      </section>
      <Footer classes={{ footer: styles.footer }} />

      <CreditsModal isOpen={activeModal === 'credits'} onClose={closeModal} />
      <PlayModal isOpen={activeModal === 'play'} onClose={closeModal} launchGame={() => openModal('unity')} />
      <TrailerModal isOpen={activeModal === 'trailer'} onClose={closeModal} />
      <UnityModal isOpen={activeModal === 'unity'} onClose={closeModal} />
    </>
  );
}
