'use client';

/* eslint-disable -- External Library */
import type { FieldValues, UseFormProps } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { useCallback, useEffect } from 'react';
import { toast } from '@formizee/ui';
import type { ActionState } from '@/types';

type UseFormActionProps<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any
> = UseFormProps<TFieldValues, TContext> & {
  state: ActionState | unknown;
  onSuccess?: () => void;
};

export function useFormAction<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any
>({ state, onSuccess, ...props }: UseFormActionProps<TFieldValues, TContext>) {
  const form = useForm({
    ...props
  });

  const handleSuccess = useCallback(() => {
    onSuccess?.();
  }, []);

  useEffect(() => {
    if (!hasState(state)) return;
    form.clearErrors();

    switch (state.code) {
      case 'INTERNAL_ERROR': {
        toast({
          title: 'Something went wrong.',
          description: 'Please try again later.',
          variant: 'destructive',
          duration: 5000
        });
        break;
      }
      case 'VALIDATION_ERROR': {
        const { fieldErrors } = state;
        Object.keys(fieldErrors).forEach(key => {
          form.setError(key as any, {
            message: fieldErrors[key]?.flat().join(' ')
          });
        });
        break;
      }
      case 'COMMON_ERROR': {
        toast({
          title: state.title,
          description: state.message,
          variant: 'destructive',
          duration: 5000
        });
        break;
      }
      case 'SUCCESS': {
        toast({
          title: state.message,
          duration: 5000
        });
        handleSuccess();
        form.reset();
        break;
      }
    }
  }, [state, form, handleSuccess]);

  return {
    ...form
  };
}

const hasState = (state: ActionState | unknown): state is ActionState => {
  if (!state || typeof state !== 'object') return false;

  return 'code' in state;
};
