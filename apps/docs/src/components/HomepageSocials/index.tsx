import Link from '@docusaurus/Link';
import Discord from '@site/static/icons/discord.svg';
import Twitter from '@site/static/icons/twitterX.svg';
import Github from '@site/static/icons/github.svg';
import { CenterCard, WideCard } from '../Card';
import Row, { RowThree } from '../Row';
import Section from '../Section';
import StyledIcon from '../StyledIcon';

export default function HomepageSocials() {
  return (
    <Section>
      <RowThree>
        <Link style={{ textDecoration: 'none' }} href={'https://discord.gg/niftyleague'}>
          <CenterCard>
            <StyledIcon>
              <Discord style={{ width: '48px', height: '48px' }} />
            </StyledIcon>
            <div>
              <h3>Discord</h3>
              <p>Join our community for realtime Q&amp;A.</p>
            </div>
          </CenterCard>
        </Link>
        <Link style={{ textDecoration: 'none' }} href={'https://twitter.com/NiftyLeague'}>
          <CenterCard>
            <StyledIcon>
              <Twitter style={{ width: '48px', height: '48px' }} />
            </StyledIcon>
            <div>
              <h3>Twitter (X)</h3>
              <p>Follow our latest annoucements.</p>
            </div>
          </CenterCard>
        </Link>

        <Link style={{ textDecoration: 'none' }} href={'https://github.com/NiftyLeague'}>
          <CenterCard>
            <StyledIcon>
              <Github style={{ width: '48px', height: '48px' }} />
            </StyledIcon>
            <div>
              <h3>Github</h3>
              <p>View all public Nifty League repositories.</p>
            </div>
          </CenterCard>
        </Link>
      </RowThree>
      <Row>
        <Link
          style={{
            textDecoration: 'none',
            maxWidth: '960px',
            margin: '0 auto 4rem auto',
            width: '100%',
          }}
          href={'https://www.twitch.tv/NiftyLeagueOfficial'}
        >
          <WideCard>
            <img src="/docs/img/twitch-stream.png" width={'120px'} />
            <div>
              <h2 style={{ marginBottom: '0.5rem' }}>Nifty League Twitch Streamers</h2>
              <p style={{ margin: '0rem' }}>
                Checkout our official Twitch channel for latest gameplay footage and live streams. If you are a streamer
                and want to help manage the Nifty League Official Twitch channel please reach out to our team on
                Discord!
              </p>
            </div>
          </WideCard>
        </Link>
      </Row>
    </Section>
  );
}
