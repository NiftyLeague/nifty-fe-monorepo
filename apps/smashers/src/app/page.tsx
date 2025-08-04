'use client';

import { use, useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';

import Header from '@/components/Header';
import { SocialsFooter } from '@nl/ui/custom/socials-footer';

// Lazy load below-the-fold sections with loading states
const Loading = () => (
  <section>
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <h3>Loading...</h3>
    </div>
  </section>
);

const ConsoleSection = dynamic(() => import('@nl/ui/custom/console-game').then(mod => mod.ConsoleGame), {
  loading: Loading,
  ssr: false,
});
const GameSection = dynamic(() => import('@/components/GameSection'), { loading: Loading, ssr: false });
const DegensSection = dynamic(() => import('@/components/DegensSection'), { loading: Loading, ssr: false });

type NextSearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

type ActiveModal = 'credits' | 'play' | 'trailer' | 'unity' | null;

export default function Home({ searchParams }: { searchParams: NextSearchParams }) {
  // Modal state management
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const openModal = (modal: ActiveModal) => setActiveModal(modal);

  // Handle referral link
  const { referral } = use(searchParams);
  useEffect(() => {
    if (referral) openModal('play');
  }, [referral]);

  return (
    <>
      <main>
        <section id="header">
          <Header activeModal={activeModal} />
        </section>

        <Suspense fallback={null}>
          <section id="console-game">
            <ConsoleSection src="/video/smashers-960p.mp4" />
          </section>
          <section id="game-section" className="container section relative">
            <div className="purple-bg-orb orb-top-left" />
            <GameSection />
          </section>
          <section id="degens-section" className="container section relative">
            <div className="purple-bg-orb orb-top-right" />
            <div className="purple-bg-orb orb-bottom-left" />
            <DegensSection />
          </section>
          <SocialsFooter />
        </Suspense>
      </main>
    </>
  );
}
