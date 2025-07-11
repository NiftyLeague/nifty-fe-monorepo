import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { styled } from '@mui/material/styles';

import AnimatedWrapper from '@nl/ui/custom/AnimatedWrapper';
import Icon from '@nl/ui/base/Icon';
import ThemeBtnGroup from '@/components/ThemeBtnGroup';

const StyledAccordion = styled(Accordion)({
  border: 'none',
  marginBottom: 24,
  background: '#1e242b',
  backdropFilter: 'blur(65.0688px)',
  borderRadius: '10px',

  '& .MuiCollapse-wrapper': { marginBottom: 24 },
  '& .MuiAccordionSummary-root': {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    color: 'var(--color-foreground)',
    fontWeight: 600,
    padding: 24,
  },
  '& .MuiAccordionSummary-content': { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  '& .MuiAccordionDetails-root': {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    color: 'var(--color-foreground)',
    padding: 24,
  },
});

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
    <StyledAccordion>
      <AccordionSummary
        expandIcon={<Icon name="chevron-down" size="xl" strokeWidth={2.5} />}
        aria-controls={`panel-${title}-content`}
        id={`panel-${title}-header`}
      >
        <div>
          <AnimatedWrapper>
            <h5 className="transition-fade transition-fade-start delay-lite">{title}</h5>
          </AnimatedWrapper>
          <AnimatedWrapper>
            <p className="transition-fade transition-fade-start delay-normal m-0">{location}</p>
          </AnimatedWrapper>
        </div>
        <ThemeBtnGroup
          className="max-w-40 mt-0 xl:mt-0"
          primary={{ href: link, title: 'APPLY', external: true, className: 'theme-btn-rounded max-w-fit' }}
        />
      </AccordionSummary>

      <AccordionDetails>
        <AnimatedWrapper>
          <h6 className="text-purple md:text-left transition-fade-start transition-fade delay-lite">About the Role</h6>
        </AnimatedWrapper>
        <div className="text-left">
          <AnimatedWrapper>
            <p className="transition-fade-start transition-fade delay-normal">{aboutTheRole}</p>
          </AnimatedWrapper>
        </div>
        {responsibilities && (
          <div>
            <AnimatedWrapper>
              <h6 className="text-purple pt-5 md:text-left transition-fade-start transition-fade delay-lite">
                Responsibilities:
              </h6>
            </AnimatedWrapper>
            <ul className="text-left md:text-left">
              {responsibilities.map((resp, index) => (
                <AnimatedWrapper key={index}>
                  <li className="transition-fade-start transition-fade delay-normal">{resp}</li>
                </AnimatedWrapper>
              ))}
            </ul>
          </div>
        )}
        <div className="opacity-90">
          <AnimatedWrapper>
            <h6 className="text-purple pt-5 md:text-left transition-fade-start transition-fade delay-lite">
              Requirements:
            </h6>
          </AnimatedWrapper>
          <ul className="md:text-left">
            {requirements.map((req, index) => (
              <AnimatedWrapper key={index}>
                <li className="transition-fade-start transition-fade delay-normal">{req}</li>
              </AnimatedWrapper>
            ))}
          </ul>
        </div>
        <div className="opacity-90">
          <AnimatedWrapper>
            <h6 className="text-purple pt-5 md:text-left transition-fade-start transition-fade delay-lite">
              What we offer:
            </h6>
          </AnimatedWrapper>
          <ul className="md:text-left">
            {benefits.map((ben, index) => (
              <AnimatedWrapper key={index}>
                <li className="transition-fade-start transition-fade delay-normal">{ben}</li>
              </AnimatedWrapper>
            ))}
          </ul>
        </div>
        <ThemeBtnGroup primary={{ href: link, title: 'APPLY', external: true, className: 'theme-btn-purple' }} />
      </AccordionDetails>
    </StyledAccordion>
  );
};

export default JobCard;
