'use client';

import Image from 'next/image';
import { memo } from 'react';

import useMediaQuery from '@nl/ui/hooks/useMediaQuery';

type Sponsor = { image: string; url: string; width: number; height: number };

const RenderSponsor = ({ image, url, width, height }: Sponsor) => (
  <SponsorItem key={image} image={image} url={url} width={width} height={height} />
);

const SponsorItem = ({ image, url, width, height }: Sponsor): React.ReactNode => {
  const desktop = useMediaQuery('(min-width:769px)');
  return (
    <a href={url} target="_blank" rel="noreferrer" className="block">
      <div className={desktop ? 'm-8 w-40' : 'm-6 w-20'}>
        <Image
          alt="sponsor image"
          src={image}
          width={width}
          height={height}
          priority
          sizes="100vw"
          className="w-full h-auto"
        />
      </div>
    </a>
  );
};

const Sponsors = ({ sponsors }: { sponsors: Sponsor[] }) => (
  <div className="container mx-auto px-0">
    <div className="m-0 p-0 relative py-0 sm:py-5 flex items-center justify-center text-center">
      <section className="flex flex-wrap items-center justify-center max-w-[1600px] mx-auto">
        {sponsors.map(RenderSponsor)}
      </section>
    </div>
  </div>
);

const MemoizedSponsors = memo(Sponsors);
export default MemoizedSponsors;
