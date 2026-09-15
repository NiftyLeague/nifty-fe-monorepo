import { Show, type JSX } from 'solid-js'

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
  icon?: JSX.Element
  className?: string
  inputClassName?: string
}

export default function DisplayField(props: DisplayFieldProps) {
  return (
    <div class="grid gap-2">
      <Label for={props.id}>{props.label}</Label>
      <InputGroup class={props.className}>
        <Show when={props.icon}>
          <InputGroupAddon>
            <InputGroupText>{props.icon}</InputGroupText>
          </InputGroupAddon>
        </Show>
        <InputGroupInput
          id={props.id}
          type="text"
          value={props.value}
          disabled
          class={props.inputClassName}
        />
      </InputGroup>
    </div>
  )
}
