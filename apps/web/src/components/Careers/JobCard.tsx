import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AnimatedWrapper from '@/components/AnimatedWrapper';
import { styled } from '@nl/theme';

const StyledAccordion = styled(Accordion)({
  border: 'none',
  marginBottom: 24,
  background: '#1e242b',
  backdropFilter: 'blur(65.0688px)',
  borderRadius: '10px',

  '& .MuiCollapse-wrapper': {
    marginBottom: 24,
  },
  '& .MuiAccordionSummary-root': {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    color: 'white',
    fontWeight: 600,
    padding: 24,
  },
  '& .MuiAccordionSummary-content': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  '& .MuiAccordionDetails-root': {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    color: 'white',
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

const JobCard = ({ details }: JobCardProps): JSX.Element => {
  const { title, location, aboutTheRole, responsibilities, requirements, benefits, link } = details;
  return (
    <StyledAccordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`panel-${title}-content`}
        id={`panel-${title}-header`}
      >
        <div>
          <AnimatedWrapper>
            <h5 className="animated-fade animated-fade-start transition-delay-small">{title}</h5>
          </AnimatedWrapper>
          <AnimatedWrapper>
            <p className="animated-fade animated-fade-start transition-delay-medium m-0">{location}</p>
          </AnimatedWrapper>
        </div>
        <div>
          <AnimatedWrapper>
            <a
              className="btn theme-btn-primary m-3 d-md-block d-none mw-fix animated-fade-start animated-fade transition-delay-medium"
              href={link}
              role="button"
              target="_blank"
              rel="noreferrer"
              onClick={e => e.stopPropagation()}
            >
              Apply
            </a>
          </AnimatedWrapper>
        </div>
      </AccordionSummary>

      <AccordionDetails>
        <AnimatedWrapper>
          <h6 className="color-purple md-text-left animated-fade-start animated-fade transition-delay-small">
            About the Role
          </h6>
        </AnimatedWrapper>
        <div className="md-text-left div-paragraph">
          <AnimatedWrapper>
            <p className="animated-fade-start animated-fade transition-delay-medium">{aboutTheRole}</p>
          </AnimatedWrapper>
        </div>
        {responsibilities && (
          <div className="div-paragraph">
            <AnimatedWrapper>
              <h6 className="color-purple pt-5 md-text-left animated-fade-start animated-fade transition-delay-small">
                Responsibilities:
              </h6>
            </AnimatedWrapper>
            <ul className="md-text-left">
              {responsibilities.map((resp, index) => (
                <AnimatedWrapper key={index}>
                  <li className="animated-fade-start animated-fade transition-delay-medium">{resp}</li>
                </AnimatedWrapper>
              ))}
            </ul>
          </div>
        )}
        <div className="div-paragraph">
          <AnimatedWrapper>
            <h6 className="color-purple pt-5 md-text-left animated-fade-start animated-fade transition-delay-small">
              Requirements:
            </h6>
          </AnimatedWrapper>
          <ul className="md-text-left">
            {requirements.map((req, index) => (
              <AnimatedWrapper key={index}>
                <li className="animated-fade-start animated-fade transition-delay-medium">{req}</li>
              </AnimatedWrapper>
            ))}
          </ul>
        </div>
        <div className="div-paragraph">
          <AnimatedWrapper>
            <h6 className="color-purple pt-5 md-text-left animated-fade-start animated-fade transition-delay-small">
              What we offer:
            </h6>
          </AnimatedWrapper>
          <ul className="md-text-left">
            {benefits.map((ben, index) => (
              <AnimatedWrapper key={index}>
                <li className="animated-fade-start animated-fade transition-delay-medium">{ben}</li>
              </AnimatedWrapper>
            ))}
          </ul>
        </div>
        <div className="d-flex justify-content-center m-3">
          <AnimatedWrapper>
            <a
              className="btn theme-btn-primary btn-lg animated-fade-start animated-fade transition-delay-medium"
              href={link}
              role="button"
              target="_blank"
              rel="noreferrer"
            >
              Apply
            </a>
          </AnimatedWrapper>
        </div>
      </AccordionDetails>
    </StyledAccordion>
  );
};

export default JobCard;
