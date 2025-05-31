import { geolocation } from '@vercel/edge';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { city, country } = geolocation(request);
  return new Response(`<h1>Your location is ${city}, ${country}</h1>`, {
    headers: { 'content-type': 'text/html' },
  });
}
