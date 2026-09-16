import { Button } from '@nl/ui/base/button'

const MachineButton = (props: {
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
        '--mb-top': `${props.top}px`,
        '--mb-left': `${props.left}px`,
        '--mb-w': `${props.width}px`,
        '--mb-h': `${props.height}px`,
      }}
    >
      <Button
        disabled={props.disabled ?? false}
        name={props.name}
        onClick={props.onClick}
        variant="ghost"
        class="w-full h-full"
      />
    </div>
  )
}

export default MachineButton
