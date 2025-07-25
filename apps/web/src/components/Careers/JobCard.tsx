import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@nl/ui/base/accordion';
import AnimatedWrapper from '@nl/ui/custom/AnimatedWrapper';
import ThemeBtnGroup from '@/components/ThemeBtnGroup';

interface JobCardProps {
  details: {
    id: string;
    link: string;
    title: string;
    location: string;
    aboutTheRole: string;
    responsibilities?: string[];
    requirements: string[];
    benefits: string[];
  };
}

const JobCard = ({ details }: JobCardProps): React.ReactNode => {
  const { title, location, aboutTheRole, responsibilities, requirements, benefits, link } = details;
  return (
    <Accordion type="single" collapsible className="bg-card border-1 rounded-md mb-5">
      <AccordionItem value={`panel-${title}-header`}>
        <AccordionTrigger className="px-4 md:px-6 py-8 items-center">
          <AnimatedWrapper>
            <h5 className="transition-fade transition-fade-start delay-lite">{title}</h5>
            <p className="text-muted-foreground transition-fade transition-fade-start delay-normal m-0">{location}</p>
          </AnimatedWrapper>
          <div className="flex-1" />
          <ThemeBtnGroup
            className="max-w-40 mt-0 xl:mt-0"
            primary={{ href: link, title: 'APPLY', external: true, className: 'theme-btn-rounded max-w-fit' }}
          />
        </AccordionTrigger>

        <AccordionContent className="px-4 md:px-6 text-left">
          <AnimatedWrapper>
            <h6 className="text-purple transition-fade-start transition-fade delay-lite">About the Role</h6>
            <p className="text-inherit transition-fade-start transition-fade delay-normal">{aboutTheRole}</p>

            {responsibilities && (
              <div>
                <h6 className="text-purple pt-5 transition-fade-start transition-fade delay-lite">Responsibilities:</h6>
                <ul>
                  {responsibilities.map((resp, index) => (
                    <li className="transition-fade-start transition-fade delay-normal" key={index}>
                      {resp}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <h6 className="text-purple pt-5 transition-fade-start transition-fade delay-lite">Requirements:</h6>
            <ul>
              {requirements.map((req, index) => (
                <li className="transition-fade-start transition-fade delay-normal" key={index}>
                  {req}
                </li>
              ))}
            </ul>

            <h6 className="text-purple pt-5 transition-fade-start transition-fade delay-lite">What we offer:</h6>
            <ul>
              {benefits.map((ben, index) => (
                <li className="transition-fade-start transition-fade delay-normal" key={index}>
                  {ben}
                </li>
              ))}
            </ul>
            <ThemeBtnGroup primary={{ href: link, title: 'APPLY', external: true, className: 'theme-btn-purple' }} />
          </AnimatedWrapper>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default JobCard;
