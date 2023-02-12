import clsx from 'clsx';
import type { ComponentProps, ReactNode } from 'react';

export interface Props extends ComponentProps<'button'> {
  children: ReactNode;
  variant?: 'primary' | 'success' | 'danger' | 'warning' | 'info';
  fullWidth?: boolean;
}

export function Button({ children, variant = 'primary', fullWidth = false, ...props }: Props) {
  return (
    <button
      type="button"
      {...props}
      className={clsx(
        `items-center justify-center rounded-md px-6 py-2 font-medium text-gray-800 hover:bg-opacity-90 disabled:cursor-not-allowed`,
        {
          'w-full': fullWidth,
          'bg-primary': variant === 'primary',
          'bg-success': variant === 'success',
          'bg-danger': variant === 'danger',
          'bg-warning': variant === 'warning',
          'bg-info': variant === 'info',
          'bg-gray-300 text-gray-500': props.disabled,
        },
        props.className ? props.className : '',
      )}
    >
      {children}
    </button>
  );
}
