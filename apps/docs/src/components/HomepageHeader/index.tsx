import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';

import Heading from '@theme/Heading';
import SearchBar from '@theme-original/SearchBar';
import styled from '@emotion/styled';
import StyledImage from '../StyledImage';

const DocsHeader = styled.header`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  width: 100%;
`;

const HeaderBanner = styled.div`
  display: flex;
  padding: 4rem 0;
  text-align: center;
  position: relative;
  overflow: hidden;
  flex-direction: column;
  align-items: center;

  @media screen and (max-width: 966px) {
    padding: 2rem;
  }
`;

const HideMedium = styled.div`
  @media (max-width: 960px) {
    display: none;
  }
`;

const StyledTitleImage = styled(StyledImage)`
  width: 100%;
  height: 110%;
  object-fit: cover;
  z-index: -1;
  position: absolute;
  opacity: 0.2;
  mask-image: linear-gradient(rgba(0, 0, 0, 1), transparent);
`;

export default function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <DocsHeader>
      <HeaderBanner>
        <Heading as="h1">{siteConfig.title}</Heading>
        <p
          style={{
            maxWidth: '640px',
            marginTop: '1rem',
            fontWeight: 500,
          }}
        >
          The pages that follow contain comprehensive documentation of the Nifty League ecosystem. If you are new to
          Nifty League, you might want to check out our{' '}
          <Link style={{ color: '#ff007a' }} to="/docs/faq/general">
            FAQ
          </Link>{' '}
          first.
        </p>
        <HideMedium>
          <SearchBar />
        </HideMedium>
      </HeaderBanner>
      <StyledTitleImage
        alt="Header Background Image"
        sources={{
          light: useBaseUrl('/img/mars.png'),
          dark: useBaseUrl('/img/sushi.png'),
        }}
      />
    </DocsHeader>
  );
}
