import OptimizedImage from '@nl/ui/custom/optimized-image'

interface TeamCardProps {
  name: string
  source: string
  link?: string
}

const TeamCardItem = ({ name, source, link }: TeamCardProps): React.ReactNode => (
  <div className="grid h-full bg-card border-1 rounded-default">
    <div className="w-full flex flex-col justify-center text-center mx-auto p-2">
      {link ? (
        <a href={link} target="_blank" rel="noreferrer">
          <div className="w-full rounded-[10px] overflow-hidden">
            <OptimizedImage
              src={source}
              width="258"
              height="278"
              alt="Team Degen image"
              sizes="(max-width: 614px) 50vw, 33vw"
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
        </a>
      ) : (
        <div className="w-full rounded-[10px] overflow-hidden">
          <OptimizedImage
            src={source}
            width="258"
            height="278"
            alt="Team Degen image"
            sizes="(max-width: 614px) 50vw, 33vw"
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      )}
      <h3 className="my-5 truncate-text-1 heading-look-6">{name}</h3>
    </div>
  </div>
)

export default TeamCardItem
