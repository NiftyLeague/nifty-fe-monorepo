import { cn } from '@nl/ui/utils'

// ==============================|| CHIP ||============================== //

interface ChipProps {
  colorType?:
    'default' | 'primary' | 'secondary' | 'info' | 'success' | 'error' | 'warning' | 'orange'
  sx?: React.CSSProperties
  disabled?: boolean
  label?: React.ReactNode
  avatar?: React.ReactNode
  onDelete?: () => void
  onClick?: () => void
  variant?: 'filled' | 'outlined'
  size?: 'small' | 'medium'
  className?: string
}

const palettes: Record<
  NonNullable<ChipProps['colorType']>,
  { filled: string; outlined: string }
> = {
  default: {
    filled: 'text-purple-200 bg-purple-600 hover:bg-purple-600',
    outlined: 'text-purple-400 border border-purple-400 hover:bg-purple-600 hover:text-purple-200',
  },
  primary: {
    filled: 'text-purple-200 bg-purple-600 hover:bg-purple-600',
    outlined: 'text-purple-400 border border-purple-400 hover:bg-purple-600 hover:text-purple-200',
  },
  secondary: {
    filled: 'text-info-light bg-info-dark hover:bg-info-dark',
    outlined: 'text-info border border-info hover:bg-info-dark hover:text-info-light',
  },
  info: {
    filled: 'text-info-light bg-info-dark hover:bg-info-dark',
    outlined: 'text-info border border-info hover:bg-info-dark hover:text-info-light',
  },
  success: {
    filled: 'text-success-light bg-success-dark hover:bg-success-dark',
    outlined: 'text-success border border-success hover:bg-success-dark hover:text-success-light',
  },
  error: {
    filled: 'text-error-light bg-error-dark hover:bg-error-dark',
    outlined: 'text-error border border-error hover:bg-error-dark hover:text-error-light',
  },
  warning: {
    filled: 'text-warning-light bg-warning-dark hover:bg-warning-dark',
    outlined: 'text-warning border border-warning hover:bg-warning-dark hover:text-warning-light',
  },
  orange: {
    filled: 'text-orange-200 bg-orange-600 hover:bg-orange-600',
    outlined: 'text-orange-400 border border-orange-400 hover:bg-orange-600 hover:text-orange-200',
  },
}

const Chip = ({
  colorType = 'default',
  disabled,
  sx,
  label,
  avatar,
  onDelete,
  onClick,
  variant = 'filled',
  size = 'medium',
  className,
  ...others
}: ChipProps) => {
  const palette = palettes[colorType] || palettes.default
  const classes = cn(
    'inline-flex items-center gap-1 rounded-full font-medium whitespace-nowrap',
    size === 'small' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-0.5 text-xs',
    variant === 'outlined' ? palette.outlined : palette.filled,
    disabled && 'text-base-500 bg-base-50 hover:bg-base-50 hover:text-base-500',
    onClick && 'cursor-pointer',
    className
  )

  return (
    <span
      className={classes}
      style={sx}
      role={onClick ? 'button' : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...others}
    >
      {avatar}
      {label}
      {onDelete && (
        <button
          type="button"
          aria-label="delete"
          className="cursor-pointer text-inherit opacity-70 hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
        >
          ×
        </button>
      )}
    </span>
  )
}

export default Chip
