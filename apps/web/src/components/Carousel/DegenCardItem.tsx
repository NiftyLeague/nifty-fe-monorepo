import Image from 'next/image';
import { memo } from 'react';

export interface Degen {
  name: string;
  source: string;
  createdDate: string;
}

export const RenderDegen = (degen: Degen) => (
  <DegenCardItem key={degen.name} name={degen.name} createdDate={degen.createdDate} source={degen.source} />
);

const DegenCardItem = ({
  name,
  source,
  createdDate,
}: {
  name: string;
  source: string;
  createdDate: string;
}): React.ReactNode => (
  <div className="grid h-full bg-card border-1 rounded-default">
    <div className="p-3 md:p-4">
      <div className="flex justify-between items-center">
        <h6 className="truncate-text-1 text-xs">{name}</h6>
        <div className="hidden sm:inline-block">
          <Image src="/icons/opensea.svg" alt="OpenSea Logo" width={20} height={20} />
        </div>
      </div>
      <div className="hidden md:flex items-center pt-3">
        <button className="text-muted-foreground text-[9px] border-2 rounded-sm uppercase py-0.5 px-1 mr-2">
          Created
        </button>
        <span className="text-muted-foreground text-xs">{createdDate}</span>
      </div>
    </div>
    <div className="rounded-[20px]">
      <Image src={source} width="258" height="278" alt="degen image" priority sizes="100vw" className="w-full h-auto" />
    </div>
  </div>
);

const MemoizedDegenCardItem = memo(DegenCardItem);
export default MemoizedDegenCardItem;
