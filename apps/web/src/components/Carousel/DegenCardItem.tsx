'use client';

import Image from 'next/image';
import { memo } from 'react';
import { useMediaQuery } from '@mui/material';

import styles from './index.module.css';

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
}): React.ReactNode => {
  const mobile = useMediaQuery('(max-width:640px)');
  const small = useMediaQuery('(max-width:768px)');
  return (
    <div className="slide">
      <div className={styles.slide_content}>
        <div className={styles.browse_single}>
          {!mobile ? (
            <div className="flex p-2 sm:p-3 md:p-4 pb-0 items-center">
              <h6 className="mr-auto mb-0">{name}</h6>
              <div className="ml-auto">
                <Image src="/icons/opensea.svg" alt="OpenSea Logo" width={20} height={20} />
              </div>
            </div>
          ) : null}
          {!small ? (
            <div className="flex px-2 sm:px-4 pb-3 items-center">
              <button className="mr-1">Created</button>
              <label>{createdDate}</label>
            </div>
          ) : null}

          <div className="rounded-[20px]">
            <Image
              src={source}
              width="258"
              height="278"
              alt="degen image"
              priority
              sizes="100vw"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const MemoizedDegenCardItem = memo(DegenCardItem);
export default MemoizedDegenCardItem;
