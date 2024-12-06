'use client';

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport
} from './toast';
import {useToast} from './use-toast';

export function Toaster(): JSX.Element {
  const {toasts} = useToast();

  return (
    <ToastProvider>
      {toasts.map(({id, title, description, action, ...props}) => {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title ? <ToastTitle>{title}</ToastTitle> : null}
              {description ? (
                <ToastDescription>{description}</ToastDescription>
              ) : null}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
