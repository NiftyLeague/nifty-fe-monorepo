'use client';

import { useEffect, useState, Suspense } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';

import Navbar from '@/components/Navbar';
import ConsoleGame from '@/components/ConsoleGame';
import GameSection from '@/components/GameSection';
import DegensSection from '@/components/DegensSection';
import Footer from '@/components/Footer';
import UnityModal from '@/components/UnityModal';
import HomeSearchParamsHandler from './HomeSearchParamsHandler';
import styles from '@/styles/smashers.module.css';

const GameSelectModal = dynamic(() => import('@/components/GameSelectModal'), { ssr: false });
const TrailerModal = dynamic(() => import('@/components/TrailerModal'), { ssr: false });

export default function Home() {
  const [gameOpen, setGameOpen] = useState(false);
  const launchGame = () => setGameOpen(true);
  const closeGame = () => setGameOpen(false);

  const handleReferral = () => {
    const playBtn = document.getElementById('play-btn');
    playBtn?.click();
  };

  return (
    <>
      <Suspense fallback={null}>
        <HomeSearchParamsHandler onReferral={handleReferral} />
      </Suspense>
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
            <div className={styles.buttons}>
              <button id="trailer-btn">
                <Image
                  src="/icons/socials/youtube.svg"
                  alt="YouTube Logo"
                  width={22}
                  height={22}
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                  }}
                />
                Trailer
              </button>
              <button id="play-btn">
                <Image
                  src="/icons/controller.svg"
                  alt="Game Icon"
                  width={22}
                  height={22}
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                  }}
                />
                Play
              </button>
            </div>
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
      <TrailerModal />
      <GameSelectModal launchGame={launchGame} />
      <UnityModal gameOpen={gameOpen} closeGame={closeGame} />
    </>
  );
}
