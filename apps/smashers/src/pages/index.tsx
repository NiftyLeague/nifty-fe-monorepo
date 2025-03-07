import { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import ConsoleGame from '@/components/ConsoleGame';
import GameSection from '@/components/GameSection';
import DegensSection from '@/components/DegensSection';
import Footer from '@/components/Footer';
import UnityModal from '@/components/UnityModal';
import styles from '@/styles/smashers.module.css';
import { useSearchParams } from 'next/navigation';

const GameSelectModal = dynamic(() => import('@/components/GameSelectModal'), { ssr: false });
const TrailerModal = dynamic(() => import('@/components/TrailerModal'), { ssr: false });

export default function Home() {
  const search = useSearchParams();
  const [gameOpen, setGameOpen] = useState(false);
  const launchGame = () => setGameOpen(true);
  const closeGame = () => setGameOpen(false);

  useEffect(() => {
    if (search.has('referral')) {
      const playBtn = document.getElementById('play-btn');
      playBtn?.click();
    }
  }, [search]);

  return (
    <>
      <Head>
        <title>Nifty Smashers</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Nifty Smashers - Free to Play Fighting Game" />
        <meta
          name="description"
          content="Nifty Smashers is a free-to-play online multiplayer 3D party platform fighter. Play on iOS, Android, and Steam with full cross-play support! Jump in and brawl anytime, anywhere!"
          key="desc"
        />
        <meta
          property="og:description"
          content="Nifty Smashers is a free-to-play online multiplayer 3D party platform fighter. Play on iOS, Android, and Steam with full cross-play support! Jump in and brawl anytime, anywhere!"
        />
        <meta property="og:image" content="https://niftysmashers.com/img/console-game/classic-gaming-reinvented.webp" />
        å
      </Head>
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
