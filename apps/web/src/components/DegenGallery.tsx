import OptimizedImage from '@nl/ui/custom/optimized-image'
import { cx } from '@nl/ui/class-names'

import { NIFTY_DEGENS_ALL } from '@/constants/degens'
import styles from '@/app/(main)/degens/index.module.css'

export default function DegenGallery() {
  return (
    <section className="section relative">
      <div className="purple-bg-orb orb-bottom-right" />
      <div
        className={cx(
          styles.list,
          'flex flex-wrap items-center md:flex-row w-full justify-between'
        )}
      >
        {NIFTY_DEGENS_ALL.map(({ name, image }) => (
          <div className="flex flex-col mb-3 px-3 w-1/3" key={name}>
            <div>
              <OptimizedImage
                src={image.link}
                alt={name}
                width={image.width}
                height={image.height}
                sizes="(max-width: 768px) 33vw, 205px"
                className="pixelated mx-auto"
              />
            </div>
            <h6 className="mx-auto text-center mt-3">{name}</h6>
          </div>
        ))}
      </div>
    </section>
  )
}
