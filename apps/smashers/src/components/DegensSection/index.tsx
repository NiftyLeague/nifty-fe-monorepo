import AnimatedWrapper from '@nl/ui/custom/AnimatedWrapper';
import DegenSpecialsTable from '@nl/ui/custom/DegenSpecialsTable';

const DegensSection = () => {
  return (
    <>
      <div className="mb-10 max-w-3xl mx-auto">
        <div className="mb-5">
          <AnimatedWrapper>
            <h2 className="text-center transition-vertical-fade transition-vertical-fade-start delay-lite">
              Choose your fighter
            </h2>
          </AnimatedWrapper>
        </div>
        <div className="relative">
          <AnimatedWrapper>
            <p className="text-center transition-vertical-fade transition-vertical-fade-start delay-normal">
              There are 7 tribes to choose from, each with their own unique special ability. Some characters specialize
              in melee combat, while others are skilled in ranged attacks or magic.
            </p>
          </AnimatedWrapper>
        </div>
      </div>

      <DegenSpecialsTable />
    </>
  );
};

export default DegensSection;
