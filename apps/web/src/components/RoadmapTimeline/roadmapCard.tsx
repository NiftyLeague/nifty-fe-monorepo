import Image from 'next/image';
import { Icon } from '@nl/ui/base/icon';
import { cn } from '@nl/ui/utils';
import styles from './index.module.css';

interface RoadmapCardProps {
  body: React.ReactNode;
  current?: boolean;
  completed?: boolean;
  completionDate?: string;
  divider?: boolean;
  image?: { src: string; width: number; height: number; style: { top: string; right?: string } };
  title: string | React.ReactNode;
}

export const RenderRoadmapCard = (item: RoadmapCardProps) => <RoadmapCard key={item?.title?.toString()} {...item} />;

const RoadmapCard = ({
  body,
  current,
  completed,
  completionDate,
  divider,
  image,
  title,
}: RoadmapCardProps): React.ReactNode => (
  <div className={cn(styles.cd_timeline_block, styles.fade_in)}>
    {divider ? (
      <h4 className={styles.cd_timeline_divider}>Options below are TBD!</h4>
    ) : (
      <div className={cn(styles.cd_timeline_checkpoint, { [styles.completed as string]: completed })}>
        {completed && <Icon name="check" strokeWidth={2.5} className="m-auto" />}
      </div>
    )}

    <div className={styles.cd_timeline_content}>
      {image && (
        <div className={styles.timeline_content_img} style={image.style}>
          <Image
            src={image.src}
            unoptimized={image.src.includes('gif')}
            alt={`${title?.toString()}`}
            width={image.width}
            height={image.height}
            sizes="100vw"
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      )}
      <h5 className="[word-spacing:-10px]">{title}</h5>
      {completed && (
        <div className={styles.timeline_content_info}>
          <span className={styles.timeline_content_info_title}>Mission Accomplished</span>
          <span className={styles.timeline_content_info_date}>{completionDate}</span>
        </div>
      )}
      {body}
    </div>

    {current ? (
      <div className={styles.satoshiStationary}>
        <Image
          src="/img/space/satoshi_stationary.gif"
          unoptimized
          alt="satoshi stationary"
          width={200}
          height={200}
          sizes="100vw"
          style={{ width: '100%', height: 'auto' }}
        />
      </div>
    ) : null}
  </div>
);

export default RoadmapCard;
