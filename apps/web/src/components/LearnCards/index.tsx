import Image from 'next/image';

import { AnimatedWrapper } from '@nl/ui/custom/AnimatedWrapper';
import ThemeBtnGroup from '@/components/ThemeBtnGroup';
import { LEARN_CARDS } from './constants';

interface LearnCardProps {
  btnText: string;
  external?: boolean;
  image: string;
  link: string;
  subtitle: string;
  title: string;
}

const LearnCard = ({ btnText, external, image, link, subtitle, title }: LearnCardProps) => {
  return (
    <div className="relative flex items-center w-full h-full rounded-2xl overflow-hidden">
      <div className="absolute inset-0">
        <AnimatedWrapper>
          <div className="transition-fade-quick transition-fade-start delay-lite">
            <Image
              alt={`${title} card background`}
              priority
              src={image}
              width={552}
              height={310}
              sizes="100vw"
              style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
            />
          </div>
        </AnimatedWrapper>
      </div>

      <div className="relative w-full h-full flex flex-col items-center justify-center p-3 md:p-4 lg:p-5 text-center z-10">
        <div className="mb-4 md:mb-6">
          <AnimatedWrapper>
            <h5 className="text-center uppercase transition-vertical-fade transition-vertical-fade-start delay-lite text-xl font-bold">
              {title}
            </h5>
          </AnimatedWrapper>
        </div>
        <div className="mb-0">
          <AnimatedWrapper>
            <p className="text-center transition-vertical-fade transition-vertical-fade-start delay-normal">
              {subtitle}
            </p>
          </AnimatedWrapper>
        </div>
        <ThemeBtnGroup
          primary={{ href: link, title: btnText, external: external, className: 'theme-btn-rounded max-w-fit' }}
        />
      </div>
    </div>
  );
};

const LearnCards = () => {
  return (
    <div className="flex flex-wrap -mx-1 sm:-mx-2 pt-3 lg:pt-5 lg:mt-3">
      {LEARN_CARDS.map(({ btnText, external, image, link, subtitle, title }) => (
        <div key={title} className="w-full sm:w-1/2 p-2">
          <LearnCard
            btnText={btnText}
            external={external}
            image={image}
            link={link}
            subtitle={subtitle}
            title={title}
          />
        </div>
      ))}
    </div>
  );
};

export default LearnCards;
