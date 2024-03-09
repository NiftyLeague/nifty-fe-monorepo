import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styled from '@emotion/styled';
import Layout from '@theme/Layout';

import HomepageFeatures from '@site/src/components/HomepageFeatures';
import HomepageGuides from '@site/src/components/HomepageGuides';
import HomepageHeader from '@site/src/components/HomepageHeader';
import HomepageSocials from '@site/src/components/HomepageSocials';

const Container = styled.main`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
`;

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description="Documentation & Guides For Nifty League">
      <HomepageHeader />
      <Container>
        <HomepageFeatures />
        <HomepageGuides />
        <HomepageSocials />
      </Container>
    </Layout>
  );
}
