import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styled from '@emotion/styled';

import Github from '@site/public/icons/socials/github.svg';
import LinkArrow from '@site/public/icons/link-arrow.svg';
import { RowTwo } from '../Row';
import Card from '../Card';
import Section from '../Section';
import StyledIcon from '../StyledIcon';
import StyledImage from '../StyledImage';

type GuideLink = {
  title: string;
  text?: string;
  to: string;
};

export const GUIDE_LINKS: GuideLink[] = [
  {
    title: 'Set Up',
    text: 'Get started setting up your Ethereum wallet',
    to: '/docs/guides/set-up',
  },
  {
    title: 'Purchasing NFTL',
    text: 'Learn how to purchase NFTL tokens',
    to: '/docs/guides/buying-nftl',
  },
  {
    title: 'Playing Nifty Smashers',
    text: 'Learn how to bonk in Nifty Smashers!',
    to: '/docs/guides/nifty-smashers/general-info',
  },
];

export const GITHUB_LINKS: GuideLink[] = [
  {
    title: 'nifty-fe-monorepo',
    to: 'https://github.com/NiftyLeague/nifty-fe-monorepo',
  },
  {
    title: 'nifty-smart-contracts',
    to: 'https://github.com/NiftyLeague/nifty-smart-contracts',
  },
  {
    title: 'nifty-league-subgraph',
    to: 'https://github.com/NiftyLeague/nifty-league-subgraph',
  },
  {
    title: 'nifty-smashers-web',
    to: 'https://github.com/NiftyLeague/NiftySmashersWebApp',
  },
];

export const QUICK_LINKS: GuideLink[] = [
  {
    title: 'FAQ',
    to: '/docs/faq/general',
  },
  {
    title: 'Nifty DAO',
    to: '/docs/overview/nifty-dao/about',
  },
  {
    title: 'DEGEN NFTs',
    to: '/docs/overview/nfts/degens/about',
  },
  {
    title: 'Games',
    to: '/docs/overview/games/games-overview',
  },
  {
    title: 'NiftyVerse',
    to: '/docs/overview/games/niftyverse',
  },
  // {
  //   title: 'Whitepaper',
  //   text: "Details  on Nifty League's vision",
  //   to: 'http://niftyleague.com/whitepaper',
  // },
];

const LinkRow = styled.div`
  width: 100%;
  align-items: center;
  justify-content: space-between;
  display: flex;
  flex-direction: row;
  a h3 {
    color: black !important;
  }
`;

function Guide({ title, text, to }: GuideLink) {
  return (
    <Link style={{ textDecoration: 'none' }} key={title} to={to}>
      <Card key={title} style={{ marginBottom: '1rem' }}>
        <LinkRow>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h3 style={{ marginBottom: 0 }}>{title}</h3>
          </div>
          <LinkArrow />
        </LinkRow>
        <p style={{ marginBottom: 0 }}>{text}</p>
      </Card>
    </Link>
  );
}

function GithubLink({ title, to }: GuideLink) {
  return (
    <Link style={{ textDecoration: 'none' }} key={title} to={to}>
      <Card key={title} style={{ marginBottom: '0.94rem' }}>
        <LinkRow>
          <StyledIcon>
            <Github />
            <h3 style={{ marginBottom: 0, marginLeft: 16 }}>{title}</h3>
          </StyledIcon>
          <LinkArrow />
        </LinkRow>
      </Card>
    </Link>
  );
}

function QuickLink({ title, to }: GuideLink) {
  return (
    <Link style={{}} to={to}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '0.5rem',
        }}
      >
        <h3 style={{ marginBottom: 0 }}>{title}</h3>
        <LinkArrow />
      </div>
    </Link>
  );
}

export default function HomepageGuides(): React.ReactNode {
  return (
    <Section>
      <RowTwo>
        <div>
          <h2>Getting Started</h2>
          <p>Explore these docs to learn about our platform and find guides to start playing our games:</p>
          <div>
            {GUIDE_LINKS.map((props, idx) => (
              <Guide key={idx} {...props} />
            ))}
          </div>
        </div>
        <div>
          <h2>Developer Links</h2>
          <p>Our codebase is comprised of both open-source and proprietary software. View our public code below:</p>
          {GITHUB_LINKS.map((props, idx) => (
            <GithubLink key={idx} {...props} />
          ))}
        </div>
        <StyledImage
          style={{ maxHeight: '400px', marginTop: 'auto' }}
          sources={{
            light: useBaseUrl('/img/misc/frog_400.webp'),
            dark: useBaseUrl('/img/misc/smash_400.webp'),
          }}
        />
        <div>
          <h2>Quick Links</h2>
          <p></p>
          {QUICK_LINKS.map((props, idx) => (
            <QuickLink key={idx} {...props} />
          ))}
        </div>
      </RowTwo>
    </Section>
  );
}
