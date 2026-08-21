import { cx } from '@nl/ui/class-names'
import OptimizedImage from '@nl/ui/custom/optimized-image'
import { SOCIAL_LINKS } from './constants'

export const linkClass = 'font-medium text-foreground'
export const animateClass =
  'transition duration-200 ease-in-out hover:-translate-y-0.5 hover:scale-102 hover:opacity-70'

interface SocialsFooterProps extends React.ComponentProps<'footer'> {
  children?: React.ReactNode
  classes?: { footer?: string }
}

export function SocialsFooter({ children, classes }: SocialsFooterProps) {
  return (
    <footer className={cx('deferred-footer my-10 px-5', classes?.footer)}>
      {children}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-center gap-6">
          <a
            className={cx(linkClass, animateClass)}
            href="https://niftyleague.com/terms-of-service"
            target="_blank"
            rel="noreferrer"
          >
            Terms
          </a>
          <a
            className={cx(linkClass, animateClass)}
            href="https://niftyleague.com/disclaimer"
            target="_blank"
            rel="noreferrer"
          >
            Disclaimer
          </a>
          <a
            className={cx(linkClass, animateClass)}
            href="https://niftyleague.com/privacy-policy"
            target="_blank"
            rel="noreferrer"
          >
            Privacy Policy
          </a>
        </div>

        <div className="flex items-center justify-center gap-5 sm:gap-6">
          {SOCIAL_LINKS.map((social) => (
            <a
              key={social.name}
              href={social.link}
              target="_blank"
              rel="noreferrer"
              className={animateClass}
            >
              <OptimizedImage
                src={social.image}
                width={20}
                height={20}
                alt={social.description}
                className="w-5 h-5"
              />
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default SocialsFooter
