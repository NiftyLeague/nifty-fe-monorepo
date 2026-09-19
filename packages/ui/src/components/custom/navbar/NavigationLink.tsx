import { NavLinkContent, NAV_LINK_CONTENT_CLASS } from './NavLinkContent'

interface NavigationLinkProps {
  class?: string
  className?: string
  description?: string
  descriptionClassName?: string
  external?: boolean
  href: string
  title: string
}

/** Uses client-side navigation only for routes owned by the current app. */
function NavigationLink(props: NavigationLinkProps) {
  const resolvedClassName = () => props.class ?? props.className ?? NAV_LINK_CONTENT_CLASS

  if (props.external) {
    return (
      <a href={props.href} target="_blank" rel="noopener noreferrer" class={resolvedClassName()}>
        <NavLinkContent
          description={props.description}
          descriptionClassName={props.descriptionClassName}
          external={props.external}
          title={props.title}
        />
      </a>
    )
  }

  return (
    <a href={props.href} class={resolvedClassName()}>
      <NavLinkContent
        description={props.description}
        descriptionClassName={props.descriptionClassName}
        external={props.external}
        title={props.title}
      />
    </a>
  )
}

export default NavigationLink
