'use client';

import { memo, useContext, useState } from 'react';
import useInterval from '@/hooks/useInterval';
import IMXContext, { Context } from '@/contexts/IMXContext';
import MachineFrame from './machine-frame';
import type { Comic } from '@/types/comic';

const ComicsBurnerMachine: React.FC<
  React.PropsWithChildren<
    React.PropsWithChildren<{
      burnDisabled: boolean;
      imx: Context;
      selectedComics: Comic[];
    }>
  >
> = memo(({ burnDisabled, imx, selectedComics }) => {
  const [count, setCount] = useState<number>(0);

  useInterval(() => {
    setCount(count + 1);
  }, 500);

  return (
    <>
      <MachineFrame frames={['/img/comics/burner/machine/machine_main_3.webp']} />
      <MachineFrame frames={['/img/comics/burner/machine/fx_combined_02.gif']} />
      {!imx.registeredUser ? (
        <MachineFrame
          frames={[
            '/img/comics/burner/machine/button_connectwallet_01.webp',
            '/img/comics/burner/machine/button_connectwallet_02.webp',
          ]}
          interval={count}
        />
      ) : null}
      <MachineFrame frames={['/img/comics/burner/machine/button_help_1.webp']} />
      {!burnDisabled ? (
        <MachineFrame
          frames={[
            '/img/comics/burner/machine/button_burn_1.webp',
            '/img/comics/burner/machine/button_burn_2.webp',
            '/img/comics/burner/machine/button_burn_3.webp',
            '/img/comics/burner/machine/button_burn_4.webp',
            '/img/comics/burner/machine/button_burn_5.webp',
          ]}
          interval={count}
        />
      ) : (
        <>
          {!imx.registeredUser ? (
            <MachineFrame frames={['/img/comics/burner/machine/connectwalletabove_button_01.webp']} />
          ) : null}
          {selectedComics.length < 1 ? (
            <MachineFrame frames={['/img/comics/burner/machine/selectcomics_button_02.webp']} />
          ) : null}
          {imx.registeredUser && selectedComics.length > 1 ? (
            <MachineFrame frames={['/img/comics/burner/machine/button_burn_gray_01.webp']} />
          ) : null}
        </>
      )}

      <MachineFrame frames={['/img/comics/burner/machine/button_q_1.webp']} />
    </>
  );
});

ComicsBurnerMachine.displayName = 'ComicsBurnerMachine';

const ComicsBurnerMachineWithContext = ({
  burnDisabled = false,
  selectedComics = [],
}: {
  burnDisabled: boolean;
  selectedComics: Comic[];
}) => {
  const imx = useContext(IMXContext);
  return <ComicsBurnerMachine imx={imx} burnDisabled={burnDisabled} selectedComics={selectedComics} />;
};

export default ComicsBurnerMachineWithContext;
