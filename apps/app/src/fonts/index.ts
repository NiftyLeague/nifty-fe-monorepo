import { IBM_Plex_Sans, Lilita_One, Press_Start_2P } from 'next/font/google';
import localFont from 'next/font/local';

export const imbPlexSans = IBM_Plex_Sans({
  weight: ['100', '400', '500', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-ibm-plex-sans',
  display: 'swap',
});

export const lilitaOne = Lilita_One({
  weight: '400',
  style: 'normal',
  subsets: ['latin'],
  variable: '--font-lilita-one',
  display: 'swap',
});

export const pressStart = Press_Start_2P({
  weight: '400',
  style: 'normal',
  subsets: ['latin'],
  variable: '--font-press-start',
  display: 'swap',
});

export const nexaRustSansBlack = localFont({
  src: './Nexa_Rust_Sans_Black/NexaRustSans-Black.woff2',
  weight: '700',
  style: 'normal',
  variable: '--font-nexa-rust-sans-black',
  display: 'swap',
});
