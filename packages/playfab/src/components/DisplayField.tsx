import type { ReactNode } from 'react'

import { Label } from '@nl/ui/base/label'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@nl/ui/base/input-group'

type DisplayFieldProps = {
  id: string
  label: string
  value: string | number
  icon?: ReactNode
  className?: string
  inputClassName?: string
}

export default function DisplayField({
  id,
  label,
  value,
  icon,
  className,
  inputClassName,
}: DisplayFieldProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <InputGroup className={className}>
        {icon ? (
          <InputGroupAddon>
            <InputGroupText>{icon}</InputGroupText>
          </InputGroupAddon>
        ) : null}
        <InputGroupInput id={id} type="text" value={value} disabled className={inputClassName} />
      </InputGroup>
    </div>
  )
}
