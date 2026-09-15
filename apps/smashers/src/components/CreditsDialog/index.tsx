import { For, Show, type JSX } from 'solid-js'
import { Dialog } from '@nl/ui/custom/dialog'
import NativeImage from '@nl/ui/custom/native-image'
import { Text, Title } from '@nl/ui/custom/typography'

import type { Company, CreditsData, TeamMember } from '@/types/credits'
import creditsData from '@/data/credits.json'

// Helper function to convert company name from data to image filename
const getCompanyImagePath = (companyName: string): string => {
  const formattedName = companyName.toLowerCase().replace(/\s+/g, '-')
  return `/img/games/smashers/credits/${formattedName}.webp`
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
      style={{
        'object-fit': 'contain',
        width: '100%',
        height: 'auto',
        'max-height': `${HEIGHT * 2}px`,
      }}
      priority={isAboveTheFold}
      onError={handleImageError}
    />
  )

  return (
    <div
      style={{
        position: 'relative',
        width: `${WIDTH}px`,
        height: 'auto',
        'align-content': 'center',
      }}
    >
      <Show when={props.company.link} fallback={image}>
        <a href={props.company.link} target="_blank" rel="noopener noreferrer">
          {image}
        </a>
      </Show>
    </div>
  )
}

const SectionNote = (props: { children: JSX.Element }) => (
  <Title level={3} className="text-sm text-center">
    {props.children}
  </Title>
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
                      <Text
                        strong
                        className="text-sm md:text-base justify-self-end max-w-full overflow-hidden text-ellipsis whitespace-nowrap"
                      >
                        {member.name}
                      </Text>
                      <span />
                      <Text
                        variant="muted"
                        className="text-sm md:text-base justify-self-start max-w-full overflow-hidden text-ellipsis whitespace-nowrap"
                      >
                        {member.role}
                      </Text>
                    </>
                  ) : (
                    <Text
                      strong
                      style={{
                        'grid-column': '1 / -1',
                        overflow: 'hidden',
                        'text-align': 'center',
                        'text-overflow': 'ellipsis',
                        'white-space': 'nowrap',
                        width: '100%',
                      }}
                    >
                      {member.role}
                    </Text>
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
        <div class="text-center flex flex-wrap justify-center gap-[10px]">
          <For each={creditsData.formerMembers}>
            {(member, index) => (
              <Text class="text-sm md:text-base">
                {member}
                {index() < creditsData.formerMembers.length - 1 ? ', ' : ''}
              </Text>
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
          style={{ 'max-width': '100%', height: 'auto' }}
        />
        Credits
      </button>
    }
  >
    <CreditsContent />
  </Dialog>
)

export default CreditsDialog
