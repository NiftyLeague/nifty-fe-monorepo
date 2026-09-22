import { For, Show, type JSX } from 'solid-js'
import { Dialog } from '@nl/ui/custom/dialog'
import NativeImage from '@nl/ui/custom/native-image'

import type { Company, CreditsData, TeamMember } from '@/types/credits'
import creditsData from '@/data/credits.json'

// Helper function to convert company name from data to image filename
const getCompanyImagePath = (companyName: string): string => {
  const formattedName = companyName.toLowerCase().replace(/\s+/g, '-')
  return `https://cdn.niftyleague.com/media/img/games/smashers/credits/${formattedName}.webp`
}

const CompanyImage = (props: { company: Company }) => {
  const WIDTH = props.company.name === 'FROG SMASHERS' ? 315 : 200
  const HEIGHT = props.company.name === 'FROG SMASHERS' ? 175 : 70
  const companyIndex = (creditsData as CreditsData).companies.findIndex(
    (c) => c.name === props.company.name
  )
  const isAboveTheFold = companyIndex < 2 // Priority Load these images

  const handleImageError = (e: Event & { currentTarget: HTMLImageElement }) => {
    const target = e.currentTarget
    const parent = target.parentElement
    const isWrappedInLink = parent?.tagName === 'A'
    const container = isWrappedInLink ? parent.parentElement : parent

    if (container && !container.querySelector('h3')) {
      const textElement = document.createElement('h3')
      textElement.textContent = props.company.name
      textElement.style.textAlign = 'center'
      container.appendChild(textElement)
      target.style.display = 'none'
    }
  }

  const image = (
    <NativeImage
      src={getCompanyImagePath(props.company.name)}
      alt={`${props.company.name} Logo`}
      width={WIDTH}
      height={HEIGHT}
      class="h-auto max-h-(--credits-logo-max-h) w-full object-contain"
      style={{ '--credits-logo-max-h': `${HEIGHT * 2}px` }}
      priority={isAboveTheFold}
      onError={handleImageError}
    />
  )

  return (
    <div
      class="relative h-auto w-(--credits-logo-w) content-center"
      style={{ '--credits-logo-w': `${WIDTH}px` }}
    >
      <Show when={props.company.link} fallback={image}>
        <a href={props.company.link} target="_blank" rel="noopener noreferrer">
          {image}
        </a>
      </Show>
    </div>
  )
}

/* Section notes render the same h3/classes the level-3 Title resolved to
 * (text-sm overriding the level size), without restyling the @nl/ui Title. */
const SectionNote = (props: { children: JSX.Element }) => (
  <h3 class="text-sm text-center font-bold font-header tracking-header">{props.children}</h3>
)

const CreditsContent = () => {
  const { companies } = creditsData as CreditsData
  return (
    <>
      <For each={companies}>
        {(company) => (
          <div class="grid justify-items-center text-center gap-4 my-4">
            <Show when={company.name === 'FROG SMASHERS'}>
              <SectionNote>
                A very special thanks to Ruan Rothmann and the original creators of Frog Smashers
                (base for Nifty League&apos;s 2D Smashers)
              </SectionNote>
            </Show>

            <CompanyImage company={company} />

            <div class="grid grid-cols-[1fr_10px_1fr] gap-3">
              <For each={company.members}>
                {(member: TeamMember) =>
                  member.name ? (
                    <>
                      {/* Plain strong/span carrying the exact classes the Text
                       * component resolved to (base + variant + overrides). */}
                      <strong class="text-sm font-semibold md:text-base justify-self-end max-w-full overflow-hidden font-default tracking-default text-ellipsis whitespace-nowrap text-foreground">
                        {member.name}
                      </strong>
                      <span />
                      <span class="text-sm md:text-base justify-self-start max-w-full overflow-hidden font-default font-normal tracking-default text-ellipsis whitespace-nowrap text-muted-foreground">
                        {member.role}
                      </span>
                    </>
                  ) : (
                    <strong class="col-span-full w-full overflow-hidden text-center font-default font-semibold tracking-default text-ellipsis whitespace-nowrap text-foreground">
                      {member.role}
                    </strong>
                  )
                }
              </For>
            </div>
          </div>
        )}
      </For>

      <div class="grid gap-4 mt-12">
        <SectionNote>
          Special thanks to former team members who contributed early support, development, and
          ideas!
        </SectionNote>
        <div class="text-center flex flex-wrap justify-center gap-2.5">
          <For each={creditsData.formerMembers}>
            {(member, index) => (
              <span class="text-sm md:text-base font-default font-normal tracking-default text-foreground">
                {member}
                {index() < creditsData.formerMembers.length - 1 ? ', ' : ''}
              </span>
            )}
          </For>
        </div>
      </div>

      <div class="mt-16 mb-8 text-center">
        <SectionNote>
          A final thanks to our community, Discord mods, investors, and anyone else who helped along
          the way!
        </SectionNote>
      </div>
    </>
  )
}

const CreditsDialog = (props: { open?: boolean; onOpenChange?: (open: boolean) => void }) => (
  <Dialog
    // Controlled, not `defaultOpen`: the group drives `open`, and an
    // uncontrolled dialog ignores the prop after mount, leaving the group's
    // state desynced after the first close.
    open={props.open}
    onOpenChange={props.onOpenChange}
    title={<div class="text-center">Credits</div>}
    description="Nifty Smashers game credits and acknowledgments"
    hideDescription
    triggerElement={
      <button>
        <NativeImage
          src="/icons/credits.svg"
          alt="Credits Icon"
          width={22}
          height={22}
          class="h-auto max-w-full"
        />
        Credits
      </button>
    }
  >
    <CreditsContent />
  </Dialog>
)

export default CreditsDialog
