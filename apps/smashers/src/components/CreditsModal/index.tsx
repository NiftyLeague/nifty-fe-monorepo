'use client';

import { Fragment } from 'react';
import Image from 'next/image';
import creditsData from '@/data/credits.json';
import Typography from '@nl/ui/supabase/Typography';
import { Company, CreditsData, TeamMember } from '@/types/credits';
import Modal from '@/components/Modal';
import styles from '@/components/Modal/index.module.css';

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

const SectionNote = ({ children }: { children: React.ReactNode }) => {
  return (
    <Typography.Title
      level={3}
      style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '0.875rem', lineHeight: 1.3 }}
    >
      {children}
    </Typography.Title>
  );
};

const CreditsContent = () => {
  const { companies } = creditsData as CreditsData;

  return (
    <div style={{ maxWidth: '900px', maxHeight: '80vh', overflowY: 'auto', overflowX: 'hidden', padding: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Typography.Title level={2}>CREDITS</Typography.Title>
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
                      <Typography.Text
                        type="default"
                        style={{
                          fontWeight: 'bold',
                          justifySelf: 'end',
                          maxWidth: '40vw',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {member.name}
                      </Typography.Text>
                      <span />
                      <Typography.Text
                        type="secondary"
                        style={{
                          justifySelf: 'start',
                          maxWidth: '40vw',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {member.role}
                      </Typography.Text>
                    </Fragment>
                  ) : (
                    <Typography.Text
                      key={mIndex}
                      type="default"
                      style={{
                        fontWeight: 'bold',
                        gridColumn: '1 / -1',
                        overflow: 'hidden',
                        textAlign: 'center',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        width: '100%',
                      }}
                    >
                      {member.role}
                    </Typography.Text>
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
            <Typography.Text key={index}>
              {member}
              {index < creditsData.formerMembers.length - 1 ? ', ' : ''}
            </Typography.Text>
          ))}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '4rem', marginBottom: '2rem' }}>
        <SectionNote>
          A final thanks to our community, Discord mods, investors, and anyone else who helped along the way!
        </SectionNote>
      </div>
    </div>
  );
};

type CreditsModalProps = { isOpen: boolean; onClose: () => void };

const CreditsModal = ({ isOpen, onClose }: CreditsModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} contentClassName={styles.modal_paper_dark}>
      <CreditsContent />
    </Modal>
  );
};

export default CreditsModal;
