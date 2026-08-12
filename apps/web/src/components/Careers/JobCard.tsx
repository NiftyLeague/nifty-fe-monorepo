import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@nl/ui/base/accordion'
import ThemeBtnGroup from '@/components/ThemeBtnGroup'

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

const JobCard = ({ details }: JobCardProps): React.ReactNode => {
  const { title, location, aboutTheRole, responsibilities, requirements, benefits, link } = details
  return (
    <Accordion type="single" collapsible className="bg-card border-1 rounded-md mb-5">
      <AccordionItem value={`panel-${title}-header`}>
        <AccordionTrigger className="px-4 md:px-6 py-8 items-center">
          <h5>{title}</h5>
          <p className="text-muted-foreground m-0">{location}</p>
          <div className="flex-1" />
          <ThemeBtnGroup
            className="max-w-40 mt-0 xl:mt-0"
            primary={{
              href: link,
              title: 'APPLY',
              external: true,
              className: 'theme-btn-rounded max-w-fit',
            }}
          />
        </AccordionTrigger>

        <AccordionContent className="px-4 md:px-6 text-left">
          <h6 className="text-purple">About the Role</h6>
          <p className="text-inherit">{aboutTheRole}</p>

          {responsibilities && (
            <div>
              <h6 className="text-purple pt-5">Responsibilities:</h6>
              <ul>
                {responsibilities.map((resp, index) => (
                  <li key={index}>{resp}</li>
                ))}
              </ul>
            </div>
          )}

          <h6 className="text-purple pt-5">Requirements:</h6>
          <ul>
            {requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>

          <h6 className="text-purple pt-5">What we offer:</h6>
          <ul>
            {benefits.map((ben, index) => (
              <li key={index}>{ben}</li>
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
  )
}

export default JobCard
