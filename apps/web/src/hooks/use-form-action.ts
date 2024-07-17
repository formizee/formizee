'use client';

import type {ActionState} from '@/types';
import {toast} from '@formizee/ui';
import {useCallback, useEffect} from 'react';
import type {FieldValues, UseFormProps} from 'react-hook-form';
import {useForm} from 'react-hook-form';

type UseFormActionProps<
  TFieldValues extends FieldValues = FieldValues,
  /* biome-ignore lint: External Library */
  TContext = any
> = UseFormProps<TFieldValues, TContext> & {
  state: ActionState | unknown;
  onSuccess?: () => void;
};

export function useFormAction<
  TFieldValues extends FieldValues = FieldValues,
  /* biome-ignore lint: External Library */
  TContext = any
>({state, onSuccess, ...props}: UseFormActionProps<TFieldValues, TContext>) {
  const form = useForm({
    ...props
  });

  const handleSuccess = useCallback(() => {
    onSuccess?.();
  }, []);

  useEffect(() => {
    /* biome-ignore lint: External Library */
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
        const {fieldErrors} = state;
        /* biome-ignore lint: External Library */
        Object.keys(fieldErrors).forEach(key => {
          /* biome-ignore lint: External Library */
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
          title: state.title,
          description: state.message,
          variant: 'success',
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
  /* biome-ignore lint: External Library */
  if (!state || typeof state !== 'object') return false;

  return 'code' in state;
};
