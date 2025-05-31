'use client';

import { use, useState, useEffect, Suspense } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import dynamic from 'next/dynamic';

import Navbar from '@/components/Navbar';
import ConsoleGame from '@/components/ConsoleGame';
import ActionButtonsGroup from '@/components/ActionButtonsGroup';
import styles from '@/styles/smashers.module.css';

// Lazy load modals
const CreditsModal = dynamic(() => import('@/components/CreditsModal'), { ssr: false, loading: () => null });
const PlayModal = dynamic(() => import('@/components/PlayModal'), { ssr: false, loading: () => null });
const TrailerModal = dynamic(() => import('@/components/TrailerModal'), { ssr: false, loading: () => null });
const UnityModal = dynamic(() => import('@/components/UnityModal'), { ssr: false, loading: () => null });

// Lazy load below-the-fold sections with loading states
const LazyGameSection = dynamic(() => import('@/components/GameSection'), {
  loading: () => (
    <section className={styles.game_details}>
      <div style={{ minHeight: '50vh' }} />
    </section>
  ),
  ssr: false,
});

const LazyDegensSection = dynamic(() => import('@/components/DegensSection'), {
  loading: () => (
    <section className={styles.character_details}>
      <div style={{ minHeight: '50vh' }} />
    </section>
  ),
  ssr: false,
});

const LazyFooter = dynamic(() => import('@/components/Footer'), {
  loading: () => <footer style={{ minHeight: '200px' }} />,
  ssr: false,
});

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

  // Preload critical modal images and assets
  const preloadAssets = [
    // Play Modal Badges
    '/img/badges/google-play-badge.webp',
    '/img/badges/apple-store-badge.svg',
    '/img/badges/steam-badge.webp',
  ];

  return (
    <>
      <Head>
        {preloadAssets.map(src => {
          const isSvg = src.endsWith('.svg');
          return (
            <link
              key={src}
              rel="preload"
              as="image"
              href={src}
              imageSrcSet={isSvg ? undefined : `${src} 1x, ${src.replace(/\.(\w+)$/, '@2x.$1')} 2x`}
              crossOrigin={isSvg ? 'anonymous' : undefined}
            />
          );
        })}
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
      </section>
      <section className={styles.console_game}>
        <ConsoleGame src="/video/smashers-960p.mp4" />
      </section>

      <Suspense fallback={null}>
        <LazyGameSection />
        <LazyDegensSection />
        <LazyFooter classes={{ footer: styles.footer }} />
      </Suspense>

      <CreditsModal isOpen={activeModal === 'credits'} onClose={closeModal} />
      <PlayModal isOpen={activeModal === 'play'} onClose={closeModal} launchGame={() => openModal('unity')} />
      <TrailerModal isOpen={activeModal === 'trailer'} onClose={closeModal} />
      <UnityModal isOpen={activeModal === 'unity'} onClose={closeModal} />
    </>
  );
}
