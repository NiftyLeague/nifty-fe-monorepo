import { Button } from '@nl/ui/base/button'

const MachineButton = ({
  disabled = false,
  height,
  left,
  name,
  onClick,
  top,
  width,
}: {
  disabled?: boolean
  height: number
  left: number
  name: string
  onClick?: () => void
  top: number
  width: number
}) => {
  return (
    <div
      aria-hidden="true"
      class="absolute top-(--mb-top) left-(--mb-left) right-0 mx-auto w-(--mb-w) h-(--mb-h)"
      style={{
        '--mb-top': `${top}px`,
        '--mb-left': `${left}px`,
        '--mb-w': `${width}px`,
        '--mb-h': `${height}px`,
      }}
    >
      <Button
        disabled={disabled}
        name={name}
        onClick={onClick}
        variant="ghost"
        class="w-full h-full"
      />
    </div>
  )
}

export default MachineButton
