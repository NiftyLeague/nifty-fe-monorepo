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
    <Button
      disabled={disabled}
      name={name}
      onClick={onClick}
      variant="ghost"
      style={{
        height,
        left,
        marginLeft: 'auto',
        marginRight: 'auto',
        position: 'absolute',
        right: 0,
        top,
        width,
      }}
    />
  )
}

export default MachineButton
