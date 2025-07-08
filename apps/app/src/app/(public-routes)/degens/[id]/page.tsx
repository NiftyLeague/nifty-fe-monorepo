import { use } from 'react';
import { redirect } from 'next/navigation';
import { LEGGIES } from '@/constants/degens';
import type { Metadata, ResolvingMetadata } from 'next';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
export async function generateMetadata({ params }: PageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const { id: tokenId } = await params;
  const fileType = LEGGIES.includes(Number(tokenId)) ? 'gif' : 'webp';

  // access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `NL DEGEN #${tokenId}`,
    openGraph: { images: [`/img/degens/nfts/${tokenId}.${fileType}`, ...previousImages] },
  };
}

export default function Page({ params }: PageProps) {
  const { id: tokenId } = use(params);
  redirect(`/degens?tokenId=${tokenId}`);
}
