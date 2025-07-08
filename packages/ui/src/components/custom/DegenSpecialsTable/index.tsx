import Image from 'next/image';
import AnimatedWrapper from '@nl/ui/custom/AnimatedWrapper';
import { NIFTY_DEGENS, type DegenSpecial } from './constants';

export const DegenSpecialsTable = () => (
  <>
    <AnimatedWrapper>
      <div className="mb-5">
        <div className="flex flex-wrap -mx-4">
          <div className="w-1/2 sm:w-1/3 px-4">
            <h3 className="text-center transition-vertical-fade transition-vertical-fade-start delay-lite">TRIBE</h3>
          </div>
          <div className="w-1/2 sm:w-2/3 px-4">
            <h3 className="text-center transition-vertical-fade transition-vertical-fade-start delay-lite">SPECIAL</h3>
          </div>
        </div>
      </div>
    </AnimatedWrapper>

    <div className="relative border border-gray-200 rounded-2xl overflow-clip">
      <hr className="absolute top-0 bottom-0 left-1/2 w-px h-full my-0 mx-0 border-0 bg-[#b4b5c3] md:left-1/3" />
      {NIFTY_DEGENS.map(({ name, description, specialName, gif, image }: DegenSpecial) => (
        <div key={name} className="flex flex-row py-8">
          <div className="w-1/2 sm:w-1/3 my-auto sm:mx-auto">
            <AnimatedWrapper>
              <div className="flex flex-col">
                <div className="text-center transition-fade-slow transition-fade-start delay-lite">
                  <Image
                    src={image.link}
                    alt={name}
                    width={image.width}
                    height={image.height}
                    className="mx-auto h-auto w-[30%] sm:w-auto sm:max-w-[90px] lg:max-w-[120px]"
                  />
                </div>
                <h5 className="mt-2 text-center transition-fade-slow transition-fade-start delay-normal">{name}</h5>
              </div>
            </AnimatedWrapper>
          </div>

          <div className="hidden w-0 md:block md:w-5/12 m-auto md:ps-6 lg:ps-8">
            <AnimatedWrapper>
              <p className="font-bold transition-vertical-fade transition-vertical-fade-start delay-normal">
                {description}
              </p>
            </AnimatedWrapper>
          </div>

          <div className="w-1/2 sm:w-1/4 my-auto sm:mx-auto">
            <AnimatedWrapper>
              <div className="-mt-12 text-center transition-fade-slow transition-fade-start delay-lite">
                <Image
                  src={gif.link}
                  unoptimized
                  alt={name}
                  width={gif.width}
                  height={gif.height}
                  className="mx-auto h-auto w-auto"
                />
              </div>
              <h6 className="-mt-6 mx-auto max-w-[90%] text-center transition-fade-slow transition-fade-start delay-normal">
                {specialName}
              </h6>
            </AnimatedWrapper>
          </div>
        </div>
      ))}
    </div>
  </>
);

export default DegenSpecialsTable;
