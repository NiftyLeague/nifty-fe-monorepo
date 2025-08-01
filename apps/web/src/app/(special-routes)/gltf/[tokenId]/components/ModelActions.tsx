'use client';

import { Dispatch, SetStateAction } from 'react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@nl/ui/base/select';

import { Color } from '@/types/gltf';
import styles from '../gltf.module.css';

type ModelActionsProps = { color: Color; setColor: Dispatch<SetStateAction<Color>> };

const COLOR_OPTIONS: [string, string][] = [
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

export default function ModelActions({ color, setColor }: ModelActionsProps) {
  const handleSelectColor = (value: Color) => value && setColor(value);

  return (
    <div className={styles.menu__overlay__colorpicker}>
      <Select value={color} onValueChange={handleSelectColor}>
        <SelectTrigger className="w-[160px] border-1 border-primary">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Background Color</SelectLabel>
            {COLOR_OPTIONS.map(([value, name]) => (
              <SelectItem value={value} key={value}>
                {name.toUpperCase()}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* <Button slot="ar-button" id="ar-button">
        View in your space
      </Button> */}
    </div>
  );
}
