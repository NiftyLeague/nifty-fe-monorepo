import { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import ConsoleGame from '@/components/ConsoleGame';
import GameSection from '@/components/GameSection';
import DegensSection from '@/components/DegensSection';
import Footer from '@/components/Footer';
import TrailerModal from '@/components/TrailerModal';
import GameSelectModal from '@/components/GameSelectModal';
import UnityModal from '@/components/UnityModal';
import styles from '@/styles/smashers.module.css';
import { useSearchParams } from 'next/navigation';

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
          content="Nifty Smashers is a free 3D platform fighting game that supports up to 16 online players. Available on iOS & Android devices - full cross-play coming soon!"
          key="desc"
        />
        <meta
          property="og:description"
          content="Nifty Smashers is a free 3D platform fighting game that supports up to 16 online players. Available on iOS & Android devices - full cross-play coming soon!"
        />
        <meta
          property="og:image"
          content="https://niftysmashers.com/assets/console-game/classic-gaming-reinvented.png"
        />
      </Head>
      <section className={styles.main}>
        <div className="radial-gradient-bg-centered" />
        <div className={styles.container}>
          <Navbar />
          <div className={styles.content}>
            <Image
              src="/logo/wordmark_logo_smashers.png"
              alt="Wordmark Logo"
              className={styles.wordmark}
              width={824}
              height={572}
              priority
            />
            <div className={styles.buttons}>
              <button id="trailer-btn">
                <Image
                  src="/icons/youtube.svg"
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
        <ConsoleGame src="/assets/console-game/smashers-960p.mp4" />
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
