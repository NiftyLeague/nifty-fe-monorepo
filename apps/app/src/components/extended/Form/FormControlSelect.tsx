'use client'

import { useState } from 'react'

import { Label } from '@nl/ui/base/label'
import {
  Select as SelectBase,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@nl/ui/base/select'
import { Separator } from '@nl/ui/base/separator'
import { Icon, type IconName } from '@nl/ui/base/icon'
import { cn } from '@nl/ui/utils'

// ==============================|| FORM CONTROL SELECT ||============================== //

interface FormControlSelectProps {
  captionLabel?: string
  currencies?: { value: string; label: string }[]
  formState?: string
  iconPrimary?: IconName
  iconSecondary?: IconName
  selected?: string
  textPrimary?: string
  textSecondary?: string
}

const FormControlSelect = ({
  captionLabel,
  currencies,
  formState,
  iconPrimary,
  iconSecondary,
  selected,
  textPrimary,
  textSecondary,
}: FormControlSelectProps) => {
  const primaryIcon = iconPrimary ? <Icon name={iconPrimary} size="sm" color="gray" /> : null
  const secondaryIcon = iconSecondary ? <Icon name={iconSecondary} size="sm" color="gray" /> : null

  const errorState = formState === 'error'
  const val = selected || ''

  const [currency, setCurrency] = useState(val)

  return (
    <div className="grid w-full gap-2">
      {captionLabel && (
        <Label className={cn(errorState && 'text-destructive')}>{captionLabel}</Label>
      )}
      <div
        className={cn(
          'flex w-full items-center rounded-md border bg-transparent',
          errorState && 'border-destructive'
        )}
      >
        {primaryIcon && <span className="pl-3 text-muted-foreground">{primaryIcon}</span>}
        {textPrimary && (
          <span className="flex items-center gap-1 pl-3">
            <span className="text-sm text-muted-foreground">{textPrimary}</span>
            <Separator orientation="vertical" className="h-7 opacity-60" />
          </span>
        )}
        <SelectBase value={currency} onValueChange={(v) => setCurrency(v)}>
          <SelectTrigger
            aria-invalid={errorState}
            className={cn('w-full border-0 shadow-none', (primaryIcon || textPrimary) && 'pl-2')}
          >
            <SelectValue placeholder={captionLabel} />
          </SelectTrigger>
          <SelectContent>
            {currencies?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </SelectBase>
        {secondaryIcon && <span className="pr-3 text-muted-foreground">{secondaryIcon}</span>}
        {textSecondary && (
          <span className="flex items-center gap-1 pr-3">
            <Separator orientation="vertical" className="h-7 opacity-60" />
            <span className="text-sm text-muted-foreground">{textSecondary}</span>
          </span>
        )}
      </div>
    </div>
  )
}

export default FormControlSelect
