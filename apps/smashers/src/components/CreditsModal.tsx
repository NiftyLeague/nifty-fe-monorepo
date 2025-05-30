'use client';

import { useCallback, useEffect, useState, Fragment } from 'react';
import Image from 'next/image';
import cn from 'classnames';
import creditsData from '@/data/credits.json';
import styles from '@/styles/modal.module.css';

interface TeamMember {
  role: string;
  name?: string;
}

interface Company {
  name: string;
  link?: string;
  members: TeamMember[];
}

interface CreditsData {
  companies: Company[];
}

// Helper function to convert company name from data to image filename
const getCompanyImagePath = (companyName: string): string => {
  const formattedName = companyName.toLowerCase().replace(/\s+/g, '-');
  return `/img/games/smashers/credits/${formattedName}.webp`;
};

const CompanyImage = ({ company }: { company: Company }) => {
  const WIDTH = 500;
  const HEIGHT = 100;

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
      style={{ objectFit: 'contain', width: `100%`, height: 'auto', maxHeight: `${HEIGHT * 2}px` }}
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
  return <h3 style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '1.25rem' }}>{children}</h3>;
};

const CreditsContent = () => {
  const { companies } = creditsData as CreditsData;

  return (
    <div
      className={styles.modal_paper_dark}
      style={{ maxWidth: '800px', maxHeight: '80vh', overflowY: 'auto', padding: '2rem' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>NIFTY SMASHERS CREDITS</h1>
      </div>

      <div>
        {companies.map((company, index) => (
          <div key={index} style={{ marginBottom: '4rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              {company.name === 'FROG SMASHERS' ? (
                <SectionNote>
                  A very special thanks to Ruan Rothmann and the original creators of <br />
                  Frog Smashers (base for Nifty League&apos;s 2D Smashers)
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

export default function CreditsModal() {
  const [visible, setVisible] = useState(false);

  const openModal = useCallback(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const closeModal = useCallback((e?: Event) => {
    if (e && e.target !== e.currentTarget) return;
    requestAnimationFrame(() => {
      setVisible(false);
    });
  }, []);

  useEffect(() => {
    const creditsBtn = document.getElementById('credits-btn');
    const closeBtn = document.getElementById('credits-close-icon');
    const modal = document.getElementById('credits-modal');

    // Add event listeners with passive option where appropriate
    creditsBtn?.addEventListener('click', openModal);
    modal?.addEventListener('click', closeModal);
    modal?.addEventListener('touchstart', closeModal, { passive: true });
    closeBtn?.addEventListener('click', closeModal);
    closeBtn?.addEventListener('touchstart', closeModal, { passive: true });

    return function cleanup() {
      creditsBtn?.removeEventListener('click', openModal);
      modal?.removeEventListener('click', closeModal);
      modal?.removeEventListener('touchstart', closeModal);
      closeBtn?.removeEventListener('click', closeModal);
      closeBtn?.removeEventListener('touchstart', closeModal);
    };
  }, [openModal, closeModal]);

  return (
    <div id="credits-modal" className={cn(styles.modal, { hidden: !visible })}>
      <CreditsContent />
      <div id="credits-close-icon" className={styles.close_icon}>
        &times;
      </div>
    </div>
  );
}
