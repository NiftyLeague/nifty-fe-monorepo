'use client';

import Image from 'next/image';
import useMediaQuery from '@mui/material/useMediaQuery';
import AnimatedWrapper from '@nl/ui/custom/AnimatedWrapper';
import { SOCIALS } from './constants';

interface SocialProps {
  link: string;
  title: string;
  subtitle: string;
  image: string;
}

const SocialCard = ({ link, title, subtitle, image }: SocialProps) => {
  const desktop = useMediaQuery('(min-width: 769px)');
  return (
    <div className="h-full">
      <AnimatedWrapper>
        <a href={link} target="_blank" rel="noreferrer" className="block h-full">
          <div
            className="community-data p-4 sm:p-6 rounded-lg bg-gradient-to-r from-purple-600/5 to-purple-500/5 bg-opacity-60 min-h-[125px] cursor-pointer h-full flex flex-col"
            style={{
              background:
                'linear-gradient(26.04deg, rgba(110, 51, 237, 0.05) -0.03%, rgba(123, 97, 255, 0.025) 99.2%), rgba(36, 37, 38, 0.6)',
            }}
          >
            <div className="flex flex-1">
              <div className="mr-4 flex-1 flex flex-col justify-center">
                <h4 className="text-purple text-lg font-medium mb-1">{title}</h4>
                <p className="text-foreground text-sm sm:text-base">{subtitle}</p>
              </div>
              <div className="flex-shrink-0 flex items-center">
                <Image
                  alt={`${title} icon`}
                  src={image}
                  width={desktop ? 63 : 40}
                  height={40}
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </a>
      </AnimatedWrapper>
    </div>
  );
};

const SocialCards = () => {
  // Split SOCIALS into pairs for each row
  const rows = [];
  for (let i = 0; i < SOCIALS.length; i += 2) {
    rows.push(SOCIALS.slice(i, i + 2));
  }

  return (
    <div className="container mx-auto px-4 mt-5 max-w-6xl">
      <div className="space-y-4">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {row.map(({ link, title, subtitle, image }) => (
              <SocialCard key={title} link={link} title={title} subtitle={subtitle} image={image} />
            ))}
            {/* Add empty div to maintain grid when there's an odd number of items */}
            {row.length === 1 && <div className="hidden lg:block" />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialCards;
