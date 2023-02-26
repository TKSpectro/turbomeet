import clsx from 'clsx';
import type { ComponentProps, ReactNode } from 'react';

export interface Props extends ComponentProps<'button'> {
  children: ReactNode;
  variant?: 'primary' | 'success' | 'danger' | 'warning' | 'info';
  fullWidth?: boolean;
  small?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  fullWidth = false,
  small = false,
  ...props
}: Props) {
  return (
    <button
      type="button"
      {...props}
      className={clsx(
        `items-center justify-center rounded-md font-medium text-gray-900 hover:bg-opacity-90 disabled:cursor-not-allowed dark:text-white`,
        {
          'w-full': fullWidth,
          'px-6 py-2': !small,
          'px-4 py-1': small,
          'bg-primary': variant === 'primary',
          'bg-success': variant === 'success',
          'bg-danger': variant === 'danger',
          'bg-warning': variant === 'warning',
          'bg-info': variant === 'info',
          'bg-gray-300 text-gray-500 dark:bg-gray-300 dark:text-gray-500': props.disabled,
        },
        props.className ? props.className : '',
      )}
    >
      {children}
    </button>
  );
}
