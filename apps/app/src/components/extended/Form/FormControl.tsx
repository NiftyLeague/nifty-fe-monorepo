// material-ui
import { Input as BaseInput } from '@nl/ui/base/input'
import { Label } from '@nl/ui/base/label'
import { Separator } from '@nl/ui/base/separator'
import { Icon, type IconName } from '@nl/ui/base/icon'
import { cn } from '@nl/ui/utils'

// ==============================|| FORM CONTROL ||============================== //

interface FormControlProps {
  captionLabel?: string
  formState?: string
  iconPrimary?: IconName
  iconSecondary?: IconName
  placeholder?: string
  textPrimary?: string
  textSecondary?: string
}

const FormControl = ({
  captionLabel,
  formState,
  iconPrimary,
  iconSecondary,
  placeholder,
  textPrimary,
  textSecondary,
}: FormControlProps) => {
  const primaryIcon = iconPrimary ? <Icon name={iconPrimary} size="sm" color="gray" /> : null
  const secondaryIcon = iconSecondary ? <Icon name={iconSecondary} size="sm" color="gray" /> : null

  const errorState = formState === 'error'

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
        <BaseInput
          placeholder={placeholder}
          type="text"
          aria-invalid={errorState}
          className={cn(
            'border-0 shadow-none focus-visible:ring-0',
            (primaryIcon || textPrimary) && 'pl-2'
          )}
        />
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

export default FormControl
