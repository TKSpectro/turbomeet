import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import type { ComponentProps } from 'react';
import type { FieldValues, SubmitHandler, UseFormProps, UseFormReturn } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';
import type { z } from 'zod';

export function useZodForm<TSchema extends z.ZodType>(
  props: Omit<UseFormProps<TSchema['_input']>, 'resolver'> & {
    schema: TSchema;
  },
) {
  const form = useForm<TSchema['_input']>({
    ...props,
    resolver: zodResolver(props.schema, undefined),
  });

  return form;
}

interface Props<T extends FieldValues = never> extends Omit<ComponentProps<'form'>, 'onSubmit'> {
  form: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
  fullWidth?: boolean;
}

export const Form = <T extends FieldValues>({
  form,
  onSubmit,
  children,
  fullWidth = true,
  ...props
}: Props<T>) => {
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} {...props}>
        <fieldset
          className={clsx({ 'flex flex-col space-y-2': fullWidth })}
          disabled={form.formState.isSubmitting}
        >
          {children}
        </fieldset>
      </form>
    </FormProvider>
  );
};
