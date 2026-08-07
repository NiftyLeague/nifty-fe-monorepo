import { Slider } from '@nl/ui/base/slider'
import { Title } from '@nl/ui/custom/typography'
import { memo } from 'react'

interface Props extends Omit<React.ComponentProps<typeof Slider>, 'value'> {
  value: number[]
  unit?: string
  label?: string
}

const FilterRangeSlider = ({ value, unit, ...props }: Props): React.ReactNode => (
  <div className="flex flex-col">
    <div className="flex flex-col gap-1">
      <Title
        level={6}
      >{`${(value[0] as number).toLocaleString()} - ${(value[1] as number).toLocaleString()} ${
        unit || ''
      }`}</Title>
      <Slider
        {...props}
        value={value}
        min={props.min ?? 0}
        max={props.max ?? 100}
        className="ml-2 w-[calc(100%-16px)] [&_[data-slot=slider-thumb]]:border-[var(--border-purple)] [&_[data-slot=slider-thumb]]:bg-[var(--color-purple)]"
      />
    </div>
  </div>
)

export default memo(
  FilterRangeSlider,
  (prevProps, nextProps) => prevProps.value === nextProps.value
)
