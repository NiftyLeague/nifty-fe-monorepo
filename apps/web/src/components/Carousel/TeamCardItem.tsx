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
      <div className="w-full flex flex-col justify-center text-center mx-auto p-2">
        <a href={link} target="_blank" rel="noreferrer">
          <div className="w-full rounded-[10px] overflow-hidden">
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
        <h4 className="my-5 truncate-text-1">{name}</h4>
      </div>
    </div>
  </div>
);

export default TeamCardItem;
