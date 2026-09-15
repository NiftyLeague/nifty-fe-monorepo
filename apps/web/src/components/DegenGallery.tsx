import OptimizedImage from '@nl/ui/custom/optimized-image'
import { cx } from '@nl/ui/class-names'

import { NIFTY_DEGENS_ALL } from '@/constants/degens'
import styles from '@/styles/degens.module.css'

export default function DegenGallery() {
  return (
    <section class="section relative">
      <div class="purple-bg-orb orb-bottom-right" />
      <div
        class={cx(styles.list, 'flex flex-wrap items-center md:flex-row w-full justify-between')}
      >
        {NIFTY_DEGENS_ALL.map(({ name, image }) => (
          <div class="flex flex-col mb-3 px-3 w-1/3">
            <div>
              <OptimizedImage
                src={image.link}
                alt={name}
                width={image.width}
                height={image.height}
                sizes="(max-width: 768px) 33vw, 205px"
                class="pixelated mx-auto"
              />
            </div>
            <h3 class="mx-auto text-center mt-3 heading-look-6">{name}</h3>
          </div>
        ))}
      </div>
    </section>
  )
}
