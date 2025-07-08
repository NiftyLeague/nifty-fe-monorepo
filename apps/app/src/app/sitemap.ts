import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://app.niftyleague.com', lastModified: new Date(), changeFrequency: 'yearly', priority: 1 },
    { url: 'https://app.niftyleague/dashboard', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.8 },
    {
      url: 'https://app.niftyleague/dashboard/degens',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: 'https://app.niftyleague/dashboard/gamer-profile',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: 'https://app.niftyleague/dashboard/items',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: 'https://app.niftyleague/dashboard/overview',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: 'https://app.niftyleague/dashboard/rentals',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    { url: 'https://app.niftyleague/degens', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.8 },
    { url: 'https://app.niftyleague/games', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.8 },
    {
      url: 'https://app.niftyleague/games/crypto-winter',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: 'https://app.niftyleague/games/mt-gawx',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: 'https://app.niftyleague/games/smashers',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: 'https://app.niftyleague/games/wen-game',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    { url: 'https://app.niftyleague/leaderboards', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.8 },
    { url: 'https://app.niftyleague/mint-o-matic', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.8 },
    { url: 'https://app.niftyleague/verification', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
  ];
}
