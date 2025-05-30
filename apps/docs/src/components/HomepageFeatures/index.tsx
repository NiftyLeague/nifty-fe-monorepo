import React from 'react';
import Link from '@docusaurus/Link';
import styled from '@emotion/styled';
import CodeBracketIcon from '@heroicons/react/24/solid/CodeBracketIcon';
import LinkArrow from '@site/public/icons/link-arrow.svg';
import NFTL from '@site/public/img/logos/NFTL/logo.svg';
import Logo from '@site/public/img/logos/NL/logo.svg';
import { RowThree } from '../Row';
import { ShadowCard } from '../Card';
import Section from '../Section';
import StyledIcon from '../StyledIcon';

type FeatureItem = {
  title: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  to: string;
  text: string;
  color?: string;
};

const FEATURE_LIST: FeatureItem[] = [
  {
    title: 'What is Nifty League?',
    href: '#',
    icon: Logo as React.ComponentType<React.SVGProps<SVGSVGElement>>,
    to: '/docs/overview/intro',
    text: `Explore our gaming platform's vision. Delve into core concepts, our inception, and aspirations to understand our exciting journey in Web3 gaming.`,
  },
  {
    title: 'Developers or Creators',
    href: '#',
    icon: CodeBracketIcon,
    to: '/docs/overview/nifty-dao/about',
    text: `Nifty League offers game developers a streamlined platform to kickstart their development process. Start your next game's journey with us!`,
  },
  {
    title: 'NFTL',
    href: '#',
    icon: NFTL as React.ComponentType<React.SVGProps<SVGSVGElement>>,
    to: '/docs/overview/nifty-dao/nftl/overview',
    text: `Learn about our gaming ecosystem's native currency and governance token, NFTL. What is NFTL's utility? What is governance?`,
  },
];

const TopSection = styled.div`
  width: 100%;
  align-items: center;
  justify-content: space-between;
  display: flex;
  flex-direction: row;
  margin-bottom: 1rem;
`;

const IconWrapper = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
`;

function Feature(feature: FeatureItem) {
  return (
    <Link style={{ textDecoration: 'none' }} to={feature.to}>
      <ShadowCard key={feature.title}>
        <TopSection>
          <IconWrapper>
            <StyledIcon>
              <feature.icon style={{ width: '24px' }} color={feature.color} />
            </StyledIcon>
          </IconWrapper>

          <LinkArrow />
        </TopSection>
        <h3 style={{ marginBottom: '.75rem', color: feature.color }}>{feature.title}</h3>
        <p style={{ marginBottom: '0.5rem' }}>{feature.text}</p>
      </ShadowCard>
    </Link>
  );
}

export default function HomepageFeatures(): React.ReactNode {
  return (
    <Section>
      <RowThree>
        {FEATURE_LIST.map((props, idx) => (
          <Feature key={idx} {...props} />
        ))}
      </RowThree>
    </Section>
  );
}
