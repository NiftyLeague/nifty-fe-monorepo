import { memo } from 'react';
import { AnimatedWrapper } from '@nl/ui/custom/AnimatedWrapper';

const Definitions = (): React.ReactNode => (
  <>
    <AnimatedWrapper>
      <h5 className="my-3 md:my-5 transition-fade-slow transition-fade-start delay-lite">
        Interpretation and Definitions
      </h5>
    </AnimatedWrapper>
    <AnimatedWrapper>
      <h6 className="my-3 my-md-5 transition-fade-slow transition-fade-start delay-lite">Interpretation</h6>
    </AnimatedWrapper>
    <AnimatedWrapper>
      <p className="transition-fade-slow transition-fade-start delay-lite">
        The words of which the initial letter is capitalized have meanings defined under the following conditions. The
        following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
      </p>
    </AnimatedWrapper>
    <AnimatedWrapper>
      <h6 className="my-3 my-md-5 transition-fade-slow transition-fade-start delay-lite">Definitions</h6>
    </AnimatedWrapper>
    <AnimatedWrapper>
      <p className="transition-fade-slow transition-fade-start delay-lite">
        For the purposes of these Terms and Conditions:
      </p>
    </AnimatedWrapper>
    <ul>
      <AnimatedWrapper>
        <li className="transition-fade-slow transition-fade-start delay-lite">
          <strong>Company</strong> (referred to as either &quot;the Nifty League&quot;, &quot;We&quot;, &quot;Us&quot;
          or &quot;Our&quot; in this Agreement) refers to Nifty League Inc.
        </li>
      </AnimatedWrapper>
      <AnimatedWrapper>
        <li className="transition-fade-slow transition-fade-start delay-lite">
          <strong>You</strong> (also referred to as &quot;User&quot;) refers to the individual accessing or using the
          Service, or the company, or other legal entity on behalf of which such individual is accessing or using the
          Service, as applicable.
        </li>
      </AnimatedWrapper>
      <AnimatedWrapper>
        <li className="transition-fade-slow transition-fade-start delay-lite">
          <strong>Terms and Conditions</strong> (also referred to as &quot;Terms&quot;) mean these Terms and Conditions
          that form the entire agreement between You and the Company regarding the use of the Service.
        </li>
      </AnimatedWrapper>
      <AnimatedWrapper>
        <li className="transition-fade-slow transition-fade-start delay-lite">
          <strong>Site</strong> refers to the Nifty League, accessible from https://www.nifty-league.com and all
          subdomains as well as any other media form, media channel, mobile website or mobile application related,
          linked, or otherwise connected thereto.
        </li>
      </AnimatedWrapper>
      <AnimatedWrapper>
        <li className="transition-fade-slow transition-fade-start delay-lite">
          <strong>Online Games</strong> refer to any games accessible from https://www.nifty-league.com/games while
          interacting with our Smart Contracts.
        </li>
      </AnimatedWrapper>
      <AnimatedWrapper>
        <li className="transition-fade-slow transition-fade-start delay-lite">
          <strong>Smart Contracts</strong> mean digital contracts used with our Service on the Ethereum Blockchain,
          Arbitrum (or any other applicable network) which are immutable to any alteration.
        </li>
      </AnimatedWrapper>
      <AnimatedWrapper>
        <li className="transition-fade-slow transition-fade-start delay-lite">
          <strong>Application</strong> (also referred to as &quot;App&quot;) collectively refers to the Smart Contracts,
          Site, and any Online Games offered by the Nifty League.
        </li>
      </AnimatedWrapper>
      <AnimatedWrapper>
        <li className="transition-fade-slow transition-fade-start delay-lite">
          <strong>Service</strong> refers to the App.
        </li>
      </AnimatedWrapper>
      <AnimatedWrapper>
        <li className="transition-fade-slow transition-fade-start delay-lite">
          <strong>NFT-Token</strong> means a digital good on the Ethereum Blockchain (or any other applicable network)
          which represents ownership of a certain piece of artwork such as our DEGEN NFTs or other assets offered by the
          Nifty League.
        </li>
      </AnimatedWrapper>
      <AnimatedWrapper>
        <li className="transition-fade-slow transition-fade-start delay-lite">
          <strong>Goods</strong> refer to the items and NFT-Tokens offered for sale on the Application.
        </li>
      </AnimatedWrapper>
      <AnimatedWrapper>
        <li className="transition-fade-slow transition-fade-start delay-lite">
          <strong>Orders</strong> means a request by You to purchase Goods from Us.
        </li>
      </AnimatedWrapper>
    </ul>
  </>
);

const MemoizedDefinitions = memo(Definitions);
export default MemoizedDefinitions;
