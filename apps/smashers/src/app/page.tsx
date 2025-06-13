'use client';

import { use, useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';

import Header from '@/components/Header';
import SocialsFooter from '@nl/ui/custom/SocialsFooter';

// Lazy load modals
const CreditsModal = dynamic(() => import('@/components/CreditsModal'), { ssr: false, loading: () => null });
const PlayModal = dynamic(() => import('@/components/PlayModal'), { ssr: false, loading: () => null });
const TrailerModal = dynamic(() => import('@/components/TrailerModal'), { ssr: false, loading: () => null });
const UnityModal = dynamic(() => import('@/components/UnityModal'), { ssr: false, loading: () => null });

// Lazy load below-the-fold sections with loading states
const Loading = () => (
  <section>
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <h3>Loading...</h3>
    </div>
  </section>
);

const ConsoleSection = dynamic(() => import('@/components/ConsoleGame'), { loading: Loading, ssr: false });
const GameSection = dynamic(() => import('@/components/GameSection'), { loading: Loading, ssr: false });
const DegensSection = dynamic(() => import('@/components/DegensSection'), { loading: Loading, ssr: false });

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
      <Head>
        {/* Preconnect to origins */}
        <link rel="preconnect" href="https://www.niftysmashers.com" crossOrigin="anonymous" />
      </Head>
      <main>
        <section id="header">
          <Header openModal={openModal} />
        </section>

        <Suspense fallback={null}>
          <section id="console-game">
            <ConsoleSection src="/video/smashers-960p.mp4" />
          </section>
          <section id="game-section">
            <GameSection />
          </section>
          <section id="degens-section">
            <DegensSection />
          </section>
          <SocialsFooter />
        </Suspense>
      </main>

      <CreditsModal isOpen={activeModal === 'credits'} onClose={closeModal} />
      <PlayModal isOpen={activeModal === 'play'} onClose={closeModal} launchGame={() => openModal('unity')} />
      <TrailerModal isOpen={activeModal === 'trailer'} onClose={closeModal} />
      <UnityModal isOpen={activeModal === 'unity'} onClose={closeModal} />
    </>
  );
}
