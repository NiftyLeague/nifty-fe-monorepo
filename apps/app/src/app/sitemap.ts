import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://app.niftyleague.com', lastModified: new Date(), changeFrequency: 'yearly', priority: 1 },
    {
      url: 'https://app.niftyleague.com/dashboard',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: 'https://app.niftyleague.com/dashboard/degens',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: 'https://app.niftyleague.com/dashboard/gamer-profile',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: 'https://app.niftyleague.com/dashboard/items',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: 'https://app.niftyleague.com/dashboard/overview',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: 'https://app.niftyleague.com/dashboard/rentals',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    { url: 'https://app.niftyleague.com/degens', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.8 },
    { url: 'https://app.niftyleague.com/games', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.8 },
    {
      url: 'https://app.niftyleague.com/games/crypto-winter',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: 'https://app.niftyleague.com/games/mt-gawx',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: 'https://app.niftyleague.com/games/smashers',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: 'https://app.niftyleague.com/games/wen-game',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: 'https://app.niftyleague.com/leaderboards',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: 'https://app.niftyleague.com/mint-o-matic',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: 'https://app.niftyleague.com/verification',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];
}
