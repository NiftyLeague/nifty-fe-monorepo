import { InputLabel as MuiInputLabel, InputLabelProps } from '@mui/material'

import styles from './InputLabel.module.css'

interface MUIInputLabelProps extends InputLabelProps {
  horizontal?: boolean
}

const InputLabel = ({ children, horizontal = false, ...others }: MUIInputLabelProps) => (
  <MuiInputLabel
    className={horizontal ? styles.bInputLabelHorizontal : styles.bInputLabel}
    {...others}
  >
    {children}
  </MuiInputLabel>
)

export default InputLabel
