import { DegenSpecialsTable } from '@nl/ui/custom/degen-specials-table'

const DegensSection = () => {
  return (
    <>
      <div class="mb-10 max-w-3xl mx-auto">
        <div class="mb-5">
          <h2 class="text-center transition-vertical-fade">Choose your fighter</h2>
        </div>
        <div class="relative">
          <p class="text-center transition-vertical-fade">
            There are 7 tribes to choose from, each with their own unique special ability. Some
            characters specialize in melee combat, while others are skilled in ranged attacks or
            magic.
          </p>
        </div>
      </div>

      <DegenSpecialsTable />
    </>
  )
}

export default DegensSection
