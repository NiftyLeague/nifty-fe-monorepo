import type { ComponentType, ReactNode, SVGProps } from 'react';
import Link from '@docusaurus/Link';
import styled from '@emotion/styled';
import { CodeXmlIcon, ArrowUpRightIcon, type LucideProps } from 'lucide-react';
import NFTL from '@site/public/img/logos/NFTL/logo.svg';
import Logo from '@site/public/img/logos/NL/logo.svg';
import { RowThree } from '../Row';
import { ShadowCard } from '../Card';
import Section from '../Section';
import StyledIcon from '../StyledIcon';

type FeatureItem = {
  title: string;
  href: string;
  icon: ComponentType<LucideProps> | ComponentType<SVGProps<SVGSVGElement>>;
  to: string;
  text: string;
  color?: string;
};

const FEATURE_LIST: FeatureItem[] = [
  {
    title: 'What is Nifty League?',
    href: '#',
    icon: Logo,
    to: '/docs/overview/intro',
    text: `Explore our platform's vision. Delve into core concepts, our inception, and aspirations to understand our exciting journey in Web3 gaming!`,
  },
  {
    title: 'Developers or Creators',
    href: '#',
    icon: CodeXmlIcon,
    to: '/docs/overview/nifty-dao/about',
    text: `Nifty League offers game developers a streamlined platform to kickstart their development process. Start your next game's journey here!`,
  },
  {
    title: 'NFTL',
    href: '#',
    icon: NFTL,
    to: '/docs/overview/nifty-dao/nftl/overview',
    text: `Learn about our gaming ecosystem's native currency and governance token, NFTL. What is NFTL's utility? What does governance mean?`,
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
              <feature.icon size={24} strokeWidth={1.5} color={feature.color} style={{ width: '24px' }} />
            </StyledIcon>
          </IconWrapper>

          <ArrowUpRightIcon color="#494749" size={32} strokeWidth={1.5} />
        </TopSection>
        <h4 style={{ marginBottom: '.75rem', color: feature.color }}>{feature.title}</h4>
        <p style={{ marginBottom: '0.5rem' }}>{feature.text}</p>
      </ShadowCard>
    </Link>
  );
}

export default function HomepageFeatures(): ReactNode {
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
