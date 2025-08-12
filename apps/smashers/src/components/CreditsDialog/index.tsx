'use client';

import { Fragment } from 'react';
import Image from 'next/image';
import { Dialog } from '@nl/ui/custom/dialog';
import { Text, Title } from '@nl/ui/custom/typography';

import type { Company, CreditsData, TeamMember } from '@/types/credits';
import creditsData from '@/data/credits.json';

// Helper function to convert company name from data to image filename
const getCompanyImagePath = (companyName: string): string => {
  const formattedName = companyName.toLowerCase().replace(/\s+/g, '-');
  return `/img/games/smashers/credits/${formattedName}.webp`;
};

const CompanyImage = ({ company }: { company: Company }) => {
  const WIDTH = company.name === 'FROG SMASHERS' ? 315 : 200;
  const HEIGHT = company.name === 'FROG SMASHERS' ? 175 : 70;
  const companyIndex = (creditsData as CreditsData).companies.findIndex(c => c.name === company.name);
  const isAboveTheFold = companyIndex < 2; // Priority Load these images

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    const parent = target.parentElement;
    const isWrappedInLink = parent?.tagName === 'A';
    const container = isWrappedInLink ? parent.parentElement : parent;

    if (container && !container.querySelector('h3')) {
      const textElement = document.createElement('h3');
      textElement.textContent = company.name;
      textElement.style.textAlign = 'center';
      container.appendChild(textElement);
      target.style.display = 'none';
    }
  };

  const image = (
    <Image
      src={getCompanyImagePath(company.name)}
      alt={`${company.name} Logo`}
      width={WIDTH}
      height={HEIGHT}
      style={{ objectFit: 'contain', width: '100%', height: 'auto', maxHeight: `${HEIGHT * 2}px` }}
      priority={isAboveTheFold}
      onError={handleImageError}
    />
  );

  return (
    <div style={{ position: 'relative', width: WIDTH, height: 'auto', alignContent: 'center' }}>
      {company.link ? (
        <a href={company.link} target="_blank" rel="noopener noreferrer">
          {image}
        </a>
      ) : (
        image
      )}
    </div>
  );
};

const SectionNote = ({ children }: { children: React.ReactNode }) => (
  <Title level={3} className="text-sm text-center">
    {children}
  </Title>
);

const CreditsContent = () => {
  const { companies } = creditsData as CreditsData;
  return (
    <>
      {companies.map((company, index) => (
        <div key={index} className="grid justify-items-center text-center gap-4 my-4">
          {company.name === 'FROG SMASHERS' ? (
            <SectionNote>
              A very special thanks to Ruan Rothmann and the original creators of Frog Smashers (base for Nifty
              League&apos;s 2D Smashers)
            </SectionNote>
          ) : null}

          <CompanyImage company={company} />

          <div className="grid grid-cols-[1fr_10px_1fr] gap-3">
            {company.members.map((member: TeamMember, mIndex: number) =>
              member.name ? (
                <Fragment key={mIndex}>
                  <Text
                    strong
                    className="text-sm md:text-base justify-self-end max-w-full overflow-hidden text-ellipsis whitespace-nowrap"
                  >
                    {member.name}
                  </Text>
                  <span />
                  <Text
                    variant="muted"
                    className="text-sm md:text-base justify-self-start max-w-full overflow-hidden text-ellipsis whitespace-nowrap"
                  >
                    {member.role}
                  </Text>
                </Fragment>
              ) : (
                <Text
                  key={mIndex}
                  strong
                  style={{
                    gridColumn: '1 / -1',
                    overflow: 'hidden',
                    textAlign: 'center',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    width: '100%',
                  }}
                >
                  {member.role}
                </Text>
              ),
            )}
          </div>
        </div>
      ))}

      <div className="grid gap-4 mt-12">
        <SectionNote>
          Special thanks to former team members who contributed early support, development, and ideas!
        </SectionNote>
        <div className="text-center flex flex-wrap justify-center gap-[10px]">
          {creditsData.formerMembers.map((member, index) => (
            <Text key={index} className="text-sm md:text-base">
              {member}
              {index < creditsData.formerMembers.length - 1 ? ', ' : ''}
            </Text>
          ))}
        </div>
      </div>

      <div className="mt-16 mb-8 text-center">
        <SectionNote>
          A final thanks to our community, Discord mods, investors, and anyone else who helped along the way!
        </SectionNote>
      </div>
    </>
  );
};

const CreditsDialog = ({ open }: { open: boolean }) => (
  <Dialog
    defaultOpen={open}
    title={<div className="text-center">Credits</div>}
    description="Nifty Smashers game credits and acknowledgments"
    hideDescription
    triggerElement={
      <button>
        <Image
          src="/icons/credits.svg"
          alt="Credits Icon"
          width={22}
          height={22}
          style={{ maxWidth: '100%', height: 'auto' }}
        />
        Credits
      </button>
    }
  >
    <CreditsContent />
  </Dialog>
);

export default CreditsDialog;
