import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import MainLayout from '@/components/Layout';

export const metadata: Metadata = {
  title: 'Games',
  description: 'JOIN THOUSANDS OF PLAYERS ALL OVER THE WORLD COMPETING FOR THE TOP SPOT IN THE NIFTY LEAGUE',
  openGraph: {
    title: 'Nifty League | Games',
    description: 'JOIN THOUSANDS OF PLAYERS ALL OVER THE WORLD COMPETING FOR THE TOP SPOT IN THE NIFTY LEAGUE',
    images: 'https://niftyleague.com/img/home/classic-gaming-reinvented.png',
  },
};

export default function Layout({ children }: PropsWithChildren) {
  return <MainLayout classes={{ root: 'games-pg' }}>{children}</MainLayout>;
}