'use client';

import {FieldValues, useForm, UseFormProps} from 'react-hook-form';
import {useCallback, useEffect} from 'react';
import {toast} from '@/components/ui';

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
>({state, onSuccess, ...props}: UseFormActionProps<TFieldValues, TContext>) {
  const form = useForm({
    ...props
  });

  const handleSuccess = useCallback(() => {
    onSuccess?.();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!hasState(state)) return;
    form.clearErrors();

    switch (state.code) {
      case 'INTERNAL_ERROR':
        toast({
          title: 'Something went wrong.',
          description: 'Please try again later.',
          variant: 'destructive',
          duration: 5000
        });
        break;
      case 'VALIDATION_ERROR':
        const {fieldErrors} = state;
        Object.keys(fieldErrors).forEach(key => {
          form.setError(key as any, {
            message: fieldErrors[key].flat().join(' ')
          });
        });
        break;
      case 'EXISTS_ERROR':
        form.setError(state.key as any, {message: state.message});
        break;
      case 'SUCCESS':
        toast({
          title: state.message,
          duration: 5000
        });
        handleSuccess();
        form.reset();
        break;
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
