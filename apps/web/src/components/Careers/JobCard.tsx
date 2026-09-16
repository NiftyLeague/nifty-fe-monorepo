import type { JSX } from 'solid-js'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@nl/ui/base/accordion'
import ThemeBtnGroup from '@nl/ui/custom/theme-button-group'

interface JobCardProps {
  details: {
    id: string
    link: string
    title: string
    location: string
    aboutTheRole: string
    responsibilities?: string[]
    requirements: string[]
    benefits: string[]
  }
}

const JobCard = ({ details }: JobCardProps): JSX.Element => {
  const { title, location, aboutTheRole, responsibilities, requirements, benefits, link } = details
  return (
    /* Shape/backdrop live on this wrapper (mirrors OverviewFAQ) so the
       Accordion component is not restyled from the outside. */
    <div class="bg-card border-1 rounded-md mb-5">
      <Accordion type="single" collapsible>
        <AccordionItem value={`panel-${title}-header`} class="relative">
          <AccordionTrigger class="px-4 md:px-6 py-8 pr-40 md:pr-48 items-center">
            <span class="heading-look-5">{title}</span>
            <p class="text-muted-foreground m-0">{location}</p>
            <div class="flex-1" />
          </AccordionTrigger>

          <div class="absolute right-4 top-5 z-10 md:right-6">
            <ThemeBtnGroup
              class="!mx-0 !w-auto max-w-40 !mt-0"
              primary={{
                href: link,
                title: 'APPLY',
                external: true,
                className: 'theme-btn-rounded max-w-fit',
              }}
            />
          </div>

          <AccordionContent class="px-4 md:px-6 text-left">
            <h6 class="text-purple">About the Role</h6>
            <p class="text-inherit">{aboutTheRole}</p>

            {responsibilities && (
              <div>
                <h6 class="text-purple pt-5">Responsibilities:</h6>
                <ul>
                  {responsibilities.map((resp, _index) => (
                    <li>{resp}</li>
                  ))}
                </ul>
              </div>
            )}

            <h6 class="text-purple pt-5">Requirements:</h6>
            <ul>
              {requirements.map((req, _index) => (
                <li>{req}</li>
              ))}
            </ul>

            <h6 class="text-purple pt-5">What we offer:</h6>
            <ul>
              {benefits.map((ben, _index) => (
                <li>{ben}</li>
              ))}
            </ul>
            <ThemeBtnGroup
              primary={{
                href: link,
                title: 'APPLY',
                external: true,
                className: 'theme-btn-purple',
              }}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default JobCard
