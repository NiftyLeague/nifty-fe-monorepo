'use client';

import { Fragment } from 'react';
import Image from 'next/image';
import creditsData from '@/data/credits.json';
import styles from '@/styles/modal.module.css';
import { Company, CreditsData, TeamMember } from '@/types/credits';
import Modal from '@/components/Modal';

// Helper function to convert company name from data to image filename
const getCompanyImagePath = (companyName: string): string => {
  const formattedName = companyName.toLowerCase().replace(/\s+/g, '-');
  return `/img/games/smashers/credits/${formattedName}.webp`;
};

const CompanyImage = ({ company }: { company: Company }) => {
  const WIDTH = company.name === 'FROG SMASHERS' ? 360 : 200;
  const HEIGHT = company.name === 'FROG SMASHERS' ? 200 : 70;
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
      style={{
        objectFit: 'contain',
        width: '100%',
        height: 'auto',
        maxHeight: `${HEIGHT * 2}px`,
      }}
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

const SectionNote = ({ children }: { children: React.ReactNode }) => {
  return <h3 style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '1rem' }}>{children}</h3>;
};

const CreditsContent = () => {
  const { companies } = creditsData as CreditsData;

  return (
    <div style={{ maxWidth: '800px', maxHeight: '80vh', overflowY: 'auto', padding: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>CREDITS</h1>
      </div>

      <div>
        {companies.map((company, index) => (
          <div key={index} style={{ marginBottom: '4rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              {company.name === 'FROG SMASHERS' ? (
                <SectionNote>
                  A very special thanks to Ruan Rothmann and the original creators of Frog Smashers (base for Nifty
                  League&apos;s 2D Smashers)
                </SectionNote>
              ) : null}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                <CompanyImage company={company} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 10px 1fr', gap: '0.75rem' }}>
                {company.members.map((member: TeamMember, mIndex: number) =>
                  member.name ? (
                    <Fragment key={mIndex}>
                      <span
                        style={{
                          justifySelf: 'end',
                          fontWeight: 'bold',
                          whiteSpace: 'nowrap',
                          maxWidth: '40vw',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {member.name}
                      </span>
                      <span />
                      <span
                        style={{
                          justifySelf: 'start',
                          whiteSpace: 'nowrap',
                          maxWidth: '40vw',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {member.role}
                      </span>
                    </Fragment>
                  ) : (
                    <div
                      key={mIndex}
                      style={{
                        gridColumn: '1 / -1',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                        maxWidth: '80vw',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {member.role}
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '4rem' }}>
        <SectionNote>
          Special thanks to former team members who contributed early support, development, and ideas!
        </SectionNote>
        <div style={{ textAlign: 'center', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
          {creditsData.formerMembers.map((member, index) => (
            <span key={index}>
              {member}
              {index < creditsData.formerMembers.length - 1 ? ', ' : ''}
            </span>
          ))}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '4rem', marginBottom: '2rem' }}>
        <SectionNote>
          A final thanks to our community members, Discord mods, investors, and anyone else who helped along the way!
        </SectionNote>
      </div>
    </div>
  );
};

type CreditsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CreditsModal = ({ isOpen, onClose }: CreditsModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} contentClassName={styles.modal_paper_dark}>
      <CreditsContent />
    </Modal>
  );
};

export default CreditsModal;
