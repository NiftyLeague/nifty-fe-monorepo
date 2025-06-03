import Image from 'next/image';

import styles from './index.module.css';

interface TeamCardProps {
  name: string;
  source: string;
  link?: string;
}

export const RenderTeamCardItem = (item: TeamCardProps) => (
  <TeamCardItem key={item.name} name={item.name} source={item.source} />
);

const TeamCardItem = ({ name, source, link }: TeamCardProps): React.ReactNode => (
  <div className="slide">
    <div className={styles.slide_content}>
      <div className="nifty-teams d-flex flex-column p-2" style={{ margin: 'auto' }}>
        <a href={link} target="_blank" rel="noreferrer">
          <div className="w-100" style={{ borderRadius: '10px', overflow: 'hidden' }}>
            <Image
              src={source}
              width="258"
              height="278"
              alt="Team Degen image"
              sizes="100vw"
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
        </a>
        <h4 className="mt-5 mb-5 about-team-name">{name}</h4>
      </div>
    </div>
  </div>
);

export default TeamCardItem;
