import { memo } from 'react'

import OptimizedImage from '@nl/ui/custom/optimized-image'
import { CORE_TEAM, DEGEN_DELEGATES } from '@/constants/team'

const TeamDesktop = () => {
  return (
    <div className="m-0 p-0 relative text-center items-center my-3 desktop flex flex-wrap">
      {[...CORE_TEAM, ...DEGEN_DELEGATES].map((member, index) => (
        <div key={`member-${index}`} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-4 mb-8">
          <div className="flex flex-col p-3">
            <a href={member.link} target="_blank" rel="noreferrer" className="block">
              <div className="rounded-lg overflow-hidden">
                <OptimizedImage
                  alt={`${member.name} DEGEN`}
                  className="pixelated"
                  height={293}
                  src={member.source}
                  width={268}
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>
            </a>
            <h6 className="mt-4 text-lg font-medium truncate-text-1">{member.name}</h6>
          </div>
        </div>
      ))}
    </div>
  )
}

const MemoizedTeamDesktop = memo(TeamDesktop)
export default MemoizedTeamDesktop
