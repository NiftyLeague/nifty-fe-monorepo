import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@nl/ui/base/select'

import type { Color } from '@/types/gltf'
import styles from '../gltf.module.css'

type ModelActionsProps = { color: Color; setColor: (color: Color) => void }

const COLOR_OPTIONS: [Color, string][] = [
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
]

export default function ModelActions(props: ModelActionsProps) {
  return (
    <div class={styles.menu__overlay__colorpicker}>
      <Select
        options={COLOR_OPTIONS.map(([value]) => value)}
        value={props.color}
        optionValue={(value: Color) => value}
        itemComponent={(itemProps) => (
          <SelectItem item={itemProps.item}>
            {String(itemProps.item.rawValue).toUpperCase()}
          </SelectItem>
        )}
        onChange={(value: Color | null) => value && props.setColor(value)}
      >
        <SelectTrigger class="w-[160px] border-1 border-primary">
          <SelectValue />
        </SelectTrigger>
        <SelectContent />
      </Select>
    </div>
  )
}
