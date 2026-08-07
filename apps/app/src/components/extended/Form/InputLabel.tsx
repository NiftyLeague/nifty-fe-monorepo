import { Label } from '@nl/ui/base/label'
import { cn } from '@nl/ui/utils'

import styles from './InputLabel.module.css'

interface MUIInputLabelProps extends React.ComponentProps<typeof Label> {
  horizontal?: boolean
}

const InputLabel = ({ children, horizontal = false, ...others }: MUIInputLabelProps) => (
  <Label className={cn(horizontal ? styles.bInputLabelHorizontal : styles.bInputLabel)} {...others}>
    {children}
  </Label>
)

export default InputLabel
