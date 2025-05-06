'use client';

import { Dispatch, SetStateAction } from 'react';
// import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputBase from '@mui/material/InputBase';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { styled } from '@nl/theme';

import { Color } from '@/types/gltf';
import styles from '../gltf.module.scss';

type ModelActionsProps = {
  color: Color;
  setColor: Dispatch<SetStateAction<Color>>;
};

const COLOR_OPTIONS = [
  ['blue', 'Blue'],
  ['bluegreen', 'Blue Green'],
  ['bluepurple', 'Blue Purple'],
  ['bluegrey', 'Blue Grey'],
  ['brown', 'Brown'],
  ['green', 'Green'],
  ['greenish', 'Greenish'],
  ['lightblue', 'Light Blue'],
  ['ochre', 'Ochre'],
  ['ochretwo', 'Ochre Two'],
  ['palepink', 'Pale Pink'],
  ['purple', 'Purple'],
  ['salmon', 'Salmon'],
  ['yellow', 'Yellow'],
];

const BootstrapInput = styled(InputBase)(() => ({
  fontSize: '0.875rem',
  fontFamily: 'inherit',
  'label + &': {
    marginTop: 20,
  },
  '& .MuiInputBase-input': {
    borderRadius: 4,
    position: 'relative',
    color: '#5f4ce6',
    backgroundColor: '#fff',
    border: '1px solid #5f4ce6',
    padding: '0.4rem 1rem 0.4rem 0.8rem',
    boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
    '&:focus': {
      borderRadius: 4,
      borderColor: '#5f4ce6',
      backgroundColor: '#fff',
      boxShadow: '0 0 0 0.2rem rgba(95,76,230,.25)',
    },
  },
}));

export default function ModelActions({ color, setColor }: ModelActionsProps) {
  const handleSelectColor = (e: SelectChangeEvent) => {
    setColor(e.target.value as Color);
  };

  return (
    <div className={styles.menu__overlay__colorpicker}>
      <FormControl style={{ minWidth: 135 }} size="small" variant="standard">
        <Select
          id="background-select"
          className={styles.background__picker}
          value={color}
          label="Background"
          onChange={handleSelectColor}
          input={<BootstrapInput />}
        >
          {COLOR_OPTIONS.map(([value, name]) => (
            <MenuItem value={value} key={value}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* <Button slot="ar-button" id="ar-button">
        View in your space
      </Button> */}
    </div>
  );
}
