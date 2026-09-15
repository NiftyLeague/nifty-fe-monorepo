import { ExternalIcon } from '@nl/ui/custom/external-icon'

export const NAV_LINK_CONTENT_CLASS =
  'bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring/50 flex flex-col gap-1 rounded-sm px-3 py-2 outline-none transition-colors'

interface NavLinkContentProps {
  description?: string
  descriptionClassName?: string
  external?: boolean
  title: string
}

export function NavLinkContent(props: NavLinkContentProps) {
  return (
    <>
      <span class="w-full leading-none">
        {props.title}
        {props.external && <ExternalIcon />}
      </span>
      {props.description && (
        <span
          class={`w-full text-xs leading-snug text-muted-foreground line-clamp-2 ${props.descriptionClassName ?? ''}`}
        >
          {props.description}
        </span>
      )}
    </>
  )
}
