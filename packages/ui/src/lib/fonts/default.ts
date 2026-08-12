import localFont from 'next/font/local'

export const defaultFont = localFont({
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
