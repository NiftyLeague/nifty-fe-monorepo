import { cx } from '@nl/ui/class-names'
import OptimizedImage from '@nl/ui/custom/optimized-image'
import { AnimatedImage } from '@nl/ui/custom/animated-image'
import { NavIcon } from '@nl/ui/custom/nav-icon'
import styles from './index.module.css'

interface RoadmapCardProps {
  body: React.ReactNode
  current?: boolean
  completed?: boolean
  completionDate?: string
  divider?: boolean
  image?: {
    src: string
    webpSrc?: string
    width: number
    height: number
    style: { top: string; right?: string }
  }
  title: string | React.ReactNode
}

const RoadmapCard = ({
  body,
  current,
  completed,
  completionDate,
  divider,
  image,
  title,
}: RoadmapCardProps): React.ReactNode => (
  <div className={cx(styles.cd_timeline_block, styles.fade_in)}>
    {divider ? (
      <h4 className={styles.cd_timeline_divider}>Options below are TBD!</h4>
    ) : (
      <div
        className={cx(styles.cd_timeline_checkpoint, { [styles.completed as string]: completed })}
      >
        {completed && (
          <NavIcon aria-hidden="true" className="m-auto" name="check" size={20} strokeWidth={3} />
        )}
      </div>
    )}

    <div className={styles.cd_timeline_content}>
      {image && (
        <div className={styles.timeline_content_img} style={image.style}>
          <AnimatedImage
            src={image.src}
            webpSrc={image.webpSrc}
            unoptimized={image.src.includes('gif')}
            alt={`${title?.toString()}`}
            width={image.width}
            height={image.height}
            sizes="200px"
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
        <OptimizedImage
          src="/img/space/satoshi_stationary.gif"
          unoptimized
          alt="satoshi stationary"
          width={200}
          height={200}
          sizes="(min-width: 1170px) 250px, (min-width: 1000px) 200px, (min-width: 850px) 175px, 125px"
          style={{ width: '100%', height: 'auto' }}
        />
      </div>
    ) : null}
  </div>
)

export default RoadmapCard
