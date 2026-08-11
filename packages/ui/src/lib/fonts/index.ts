import localFont from 'next/font/local'

export const imbPlexSans = localFont({
  src: [
    {
      path: './assets/ibm-plex-sans-400.woff2',
      weight: '400 700',
      style: 'normal',
    },
    {
      path: './assets/ibm-plex-sans-italic-400.woff2',
      weight: '400 700',
      style: 'italic',
    },
  ],
  variable: '--font-ibm-plex-sans',
  display: 'swap',
})

export const lilitaOne = localFont({
  src: './assets/lilita-one-400.woff2',
  variable: '--font-lilita-one',
  display: 'swap',
})

export const pressStart = localFont({
  src: './assets/press-start-2p-400.woff2',
  variable: '--font-press-start',
  display: 'swap',
})

export const nexaRustSansBlack = localFont({
  src: './NexaRustSans_Black/NexaRustSans-Black.woff2',
  weight: '700',
  style: 'normal',
  variable: '--font-nexa-rust-sans-black',
  display: 'swap',
})

export const customFontClassName = `${imbPlexSans.variable} ${lilitaOne.variable} ${nexaRustSansBlack.variable} ${pressStart.variable}`
