'use client';
// import { useState, useEffect } from 'react';
// import { getProviders } from 'next-auth/react';

export type Provider =
  | 'google'
  | 'apple'
  | 'facebook'
  | 'twitch'
  | 'discord' // not implemented in playfab
  | 'twitter'; // not implemented in playfab

// export default function useProviders(): Provider[] {
//   const [providers, setProviders] = useState<Provider[]>([]);

//   useEffect(() => {
//     const run = async () => {
//       const result = await getProviders();
//       if (result) {
//         const providers = Object.keys(result) as Provider[];
//         setProviders(providers);
//       }
//     };
//     // eslint-disable-next-line no-void
//     void run();
//   }, []);

//   return providers;
// }

// PREFER MANUAL APPROACH BECAUSE ABOVE CODE ADDS EXCESS LOAD TIME

const PROVIDERS = process.env.NEXT_PUBLIC_AUTH_PROVIDERS as string;
const PROVIDERS_LIST = PROVIDERS ? (PROVIDERS.split(',') as Provider[]) : [];

export function useProviders(): Provider[] {
  return PROVIDERS_LIST;
}

export default useProviders;
