import clsx from 'clsx';
import type { ComponentProps, ReactNode } from 'react';
import { forwardRef } from 'react';
import { useFormContext } from 'react-hook-form';

export interface Props extends ComponentProps<'textarea'> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  disableLabel?: boolean;
}

export const TextArea = forwardRef<HTMLTextAreaElement, Props>(function Input(
  { label, icon, disableLabel = false, ...props },
  ref,
) {
  const {
    formState: { errors },
  } = useFormContext();
  const error = errors[props.name || '']?.message || props.error;

  return (
    <div>
      {label && (
        <label htmlFor={`textarea-${props.name}`} className="text-md px-2 pb-1 font-semibold">
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

        <textarea
          id={`textarea-${props.name}`}
          className={clsx(
            'w-full rounded-md border bg-white py-2 text-gray-800 focus:border-primary focus:ring-primary dark:bg-gray-900 dark:text-gray-200',
            icon && 'pl-12 pr-4 ',
            !icon && 'px-4',
          )}
          ref={ref}
          {...props}
        />
      </div>
      {!disableLabel && (
        <div className="text-sm font-bold text-danger">
          <>&nbsp;{error}</>
        </div>
      )}
    </div>
  );
});
