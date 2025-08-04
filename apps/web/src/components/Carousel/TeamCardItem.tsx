import Image from 'next/image';

interface TeamCardProps {
  name: string;
  source: string;
  link?: string;
}

const TeamCardItem = ({ name, source, link }: TeamCardProps): React.ReactNode => (
  <div className="grid h-full bg-card border-1 rounded-default">
    <div className="w-full flex flex-col justify-center text-center mx-auto p-2">
      <a href={link} target="_blank" rel="noreferrer">
        <div className="w-full rounded-[10px] overflow-hidden">
          <Image
            src={source}
            width="258"
            height="278"
            alt="Team Degen image"
            sizes="100vw"
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      </a>
      <h6 className="my-5 truncate-text-1">{name}</h6>
    </div>
  </div>
);

export default TeamCardItem;
