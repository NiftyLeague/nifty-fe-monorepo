import { geolocation } from '@vercel/edge';

export const config = {
  runtime: 'edge',
};

export default function handler(request: Request) {
  const { city, country } = geolocation(request);
  return new Response(`<h1>Your location is ${city}, ${country}</h1>`, {
    headers: { 'content-type': 'text/html' },
  });
}
