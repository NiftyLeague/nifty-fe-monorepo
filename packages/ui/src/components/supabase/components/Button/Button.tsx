import React, { forwardRef, useRef, useImperativeHandle, PropsWithChildren, JSX } from 'react';
import Icon, { IconProps } from '@nl/ui/base/Icon';
import ButtonStyles from './Button.module.css';

export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  block?: boolean;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  icon?: IconProps['name'] | React.ReactNode;
  iconRight?: IconProps['name'] | React.ReactNode;
  loading?: boolean;
  loadingCentered?: boolean;
  shadow?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  style?: React.CSSProperties;
  type?: 'primary' | 'default' | 'secondary' | 'outline' | 'dashed' | 'link' | 'text';
  danger?: boolean;
  htmlType?: 'button' | 'submit' | 'reset';
  ref?: RefHandle;
  ariaSelected?: boolean;
  ariaControls?: string;
  tabIndex?: 0 | -1;
  role?: string;
  textAlign?: 'left' | 'center' | 'right';
  placeholder?: string;
  as?: keyof JSX.IntrinsicElements;
}

interface CustomButtonProps extends React.HTMLAttributes<HTMLOrSVGElement> {
  defaultChecked?: boolean;
  defaultValue?: string | number | readonly string[];
  onTransitionEndCapture?: React.TransitionEventHandler<HTMLOrSVGElement>;
}

export interface RefHandle {
  container: () => HTMLElement | null;
  button: () => HTMLButtonElement | null;
}

const Button = forwardRef<RefHandle, ButtonProps>(
  (
    {
      block,
      className,
      children,
      danger,
      disabled = false,
      onClick,
      icon,
      iconRight,
      loading = false,
      loadingCentered = false,
      shadow = true,
      size = 'xs',
      style,
      type = 'primary',
      htmlType,
      ariaSelected,
      ariaControls,
      tabIndex,
      role,
      as,
      textAlign = 'center',
      ...props
    }: ButtonProps,
    ref,
  ) => {
    // button ref
    const containerRef = useRef<HTMLElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useImperativeHandle(ref, () => ({
      container: () => {
        return containerRef.current;
      },
      button: () => {
        return buttonRef.current;
      },
    }));

    // styles
    const showIcon = loading || icon;

    const classes = [ButtonStyles['sbui-btn']];
    const containerClasses = [ButtonStyles['sbui-btn-container']];

    classes.push(ButtonStyles[`sbui-btn-${type}`]);

    if (block) {
      containerClasses.push(ButtonStyles['sbui-btn--w-full']);
      classes.push(ButtonStyles['sbui-btn--w-full']);
    }

    if (danger) {
      classes.push(ButtonStyles['sbui-btn--danger']);
    }

    if (shadow && type !== 'link' && type !== 'text') {
      classes.push(ButtonStyles['sbui-btn-container--shadow']);
    }

    if (size) {
      classes.push(ButtonStyles[`sbui-btn--${size}`]);
    }

    if (className) {
      classes.push(className);
    }

    const iconLoaderClasses = [ButtonStyles['sbui-btn--anim--spin']];

    if (loadingCentered) {
      iconLoaderClasses.push(ButtonStyles[`sbui-btn-loader--center`]);
    }
    if (loading && loadingCentered) {
      classes.push(ButtonStyles[`sbui-btn--text-fade-out`]);
    }

    classes.push(ButtonStyles[`sbui-btn--text-align-${textAlign}`]);

    // custom button tag
    const CustomButton: React.FC<CustomButtonProps> = ({ ...props }) => {
      const Tag = as as keyof JSX.IntrinsicElements;
      return <Tag {...props} />;
    };

    const RenderedButton = ({ children }: PropsWithChildren) =>
      as ? (
        <CustomButton className={classes.join(' ')} onClick={onClick} style={style}>
          {children}
        </CustomButton>
      ) : (
        <button
          {...props}
          ref={buttonRef}
          className={classes.join(' ')}
          disabled={loading || (disabled && true)}
          onClick={onClick}
          style={style}
          type={htmlType}
          aria-selected={ariaSelected}
          aria-controls={ariaControls}
          tabIndex={tabIndex}
          role={role}
        >
          {children}
        </button>
      );

    return (
      <span ref={containerRef} className={containerClasses.join(' ')}>
        <RenderedButton>
          {showIcon &&
            (loading ? (
              <Icon name="loader" size={size} className={iconLoaderClasses.join(' ')} />
            ) : icon ? (
              typeof icon === 'string' ? (
                <Icon name={icon as IconProps['name']} size={size} />
              ) : (
                icon
              )
            ) : null)}
          {children && <span>{children}</span>}
          {iconRight &&
            !loading &&
            (typeof iconRight === 'string' ? <Icon name={iconRight as IconProps['name']} size={size} /> : iconRight)}
        </RenderedButton>
      </span>
    );
  },
);

Button.displayName = 'Button';

export default Button;
