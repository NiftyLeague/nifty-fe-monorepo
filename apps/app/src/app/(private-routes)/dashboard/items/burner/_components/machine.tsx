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
      <MachineFrame frames={['/img/comics/burner/machine/machine_main_3.png']} />
      <MachineFrame frames={['/img/comics/burner/machine/fx_combined_02.gif']} />
      {!imx.registeredUser ? (
        <MachineFrame
          frames={[
            '/img/comics/burner/machine/button_connectwallet_01.png',
            '/img/comics/burner/machine/button_connectwallet_02.png',
          ]}
          interval={count}
        />
      ) : null}
      <MachineFrame frames={['/img/comics/burner/machine/button_help_1.png']} />
      {!burnDisabled ? (
        <MachineFrame
          frames={[
            '/img/comics/burner/machine/button_burn_1.png',
            '/img/comics/burner/machine/button_burn_2.png',
            '/img/comics/burner/machine/button_burn_3.png',
            '/img/comics/burner/machine/button_burn_4.png',
            '/img/comics/burner/machine/button_burn_5.png',
          ]}
          interval={count}
        />
      ) : (
        <>
          {!imx.registeredUser ? (
            <MachineFrame frames={['/img/comics/burner/machine/connectwalletabove_button_01.png']} />
          ) : null}
          {selectedComics.length < 1 ? (
            <MachineFrame frames={['/img/comics/burner/machine/selectcomics_button_02.png']} />
          ) : null}
          {imx.registeredUser && selectedComics.length > 1 ? (
            <MachineFrame frames={['/img/comics/burner/machine/button_burn_gray_01.png']} />
          ) : null}
        </>
      )}

      <MachineFrame frames={['/img/comics/burner/machine/button_q_1.png']} />
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
