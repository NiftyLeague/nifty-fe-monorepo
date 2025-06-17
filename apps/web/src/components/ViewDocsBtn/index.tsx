import AnimatedWrapper from '@nl/ui/custom/AnimatedWrapper';
import ExternalIcon from '@/components/ExternalIcon';

const ViewDocsBtn = ({ href }: { href: string }) => (
  <div className="flex justify-center mt-8">
    <AnimatedWrapper>
      <a href={href} target="_blank" rel="noreferrer">
        <button className="theme-btn-primary transition-fade-slow transition-fade-start delay-lite">
          View Docs
          <ExternalIcon />
        </button>
      </a>
    </AnimatedWrapper>
  </div>
);

export default ViewDocsBtn;
