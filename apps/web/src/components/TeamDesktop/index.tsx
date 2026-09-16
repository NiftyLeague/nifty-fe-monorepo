import OptimizedImage from '@nl/ui/custom/optimized-image'
import { CORE_TEAM, DEGEN_DELEGATES } from '@/constants/team'

export default function TeamDesktop() {
  return (
    <div class="m-0 p-0 relative text-center items-center my-3 desktop flex flex-wrap">
      {[...CORE_TEAM, ...DEGEN_DELEGATES].map((member) => (
        <div class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-4 mb-8">
          <div class="flex flex-col p-3">
            {member.link ? (
              <a href={member.link} target="_blank" rel="noreferrer" class="block">
                <div class="rounded-lg overflow-hidden">
                  <OptimizedImage
                    alt={`${member.name} DEGEN`}
                    class="pixelated w-full h-auto"
                    height={293}
                    src={member.source}
                    width={268}
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  />
                </div>
              </a>
            ) : (
              <div class="rounded-lg overflow-hidden">
                <OptimizedImage
                  alt={`${member.name} DEGEN`}
                  class="pixelated w-full h-auto"
                  height={293}
                  src={member.source}
                  width={268}
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                />
              </div>
            )}
            <h3 class="mt-4 text-lg font-medium truncate-text-1 heading-look-6">{member.name}</h3>
          </div>
        </div>
      ))}
    </div>
  )
}
