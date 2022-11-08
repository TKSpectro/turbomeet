import clsx from 'clsx';
import type { ComponentProps, ReactNode } from 'react';
import { forwardRef } from 'react';
import { useFormContext } from 'react-hook-form';

export interface Props extends ComponentProps<'input'> {
  label?: string;
  icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, icon, type = 'text', ...props },
  ref,
) {
  const {
    formState: { errors },
  } = useFormContext();
  const error = errors[props.name || ''];

  if (type === 'radio' || type === 'checkbox') {
    return (
      <>
        <input
          className="text-primary focus:border-primary self-center bg-white focus:ring-transparent"
          type={type}
          ref={ref}
          {...props}
        />

        <div className="text-sm font-bold text-red-500">
          <>&nbsp;{error?.message}</>
        </div>
      </>
    );
  }

  return (
    <div>
      {label && (
        <label htmlFor={`input-${props.name}`} className="text-md px-2 pb-1 font-semibold">
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
            {icon}

            <div className="ml-1.5 h-full w-[1px] bg-gray-800 bg-opacity-50"></div>
          </div>
        )}

        <input
          id={`input-${props.name}`}
          className={clsx(
            'focus:border-primary focus:ring-primary w-full rounded-md border bg-white py-2 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
            icon && 'pl-12 pr-4 ',
            !icon && 'px-4',
          )}
          type={type}
          ref={ref}
          {...props}
        />
      </div>

      <div className="text-sm font-bold text-red-500">
        <>&nbsp;{error?.message}</>
      </div>
    </div>
  );
});
