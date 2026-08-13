import localFont from 'next/font/local'

export const defaultFont = localFont({
  src: './assets/ibm-plex-sans-400.woff2',
  weight: '400 700',
  style: 'normal',
  variable: '--font-ibm-plex-sans',
  display: 'swap',
})
