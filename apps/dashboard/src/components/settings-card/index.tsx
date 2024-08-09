import {cn} from '@formizee/ui';

type SettingsCardVariant = 'normal' | 'destructive';

interface SettingsCardProps {
  variant?: SettingsCardVariant;
  children: React.ReactNode;
  className?: string;
}

interface SettingsCardFooterProps {
  variant?: SettingsCardVariant;
  align?: 'left' | 'right';
  children: React.ReactNode;
  className?: string;
}

export const SettingsCard = (props: SettingsCardProps) => {
  const destructive = 'border-red-200 dark:border-red-800';
  const normal = 'border-neutral-200 dark:border-neutral-800';
  const variant = props.variant === 'destructive' ? destructive : normal;

  return (
    <article
      className={cn(
        props.className,
        variant,
        'flex flex-col rounded-md border'
      )}
    >
      {props.children}
    </article>
  );
};

export const SettingsCardTitle = ({children}: {children: React.ReactNode}) => (
  <h2 className="font-semibold text-xl px-6 pt-6">{children}</h2>
);

export const SettingsCardContent = ({
  children
}: {children: React.ReactNode}) => (
  <div className="flex flex-col px-6 pb-6 pt-3 gap-3">{children}</div>
);

export const SettingsCardFooter = (props: SettingsCardFooterProps) => {
  const normal = 'border-neutral-200 dark:border-neutral-800';
  const destructive =
    'border-red-200 dark:border-red-800 bg-red-400/20 dark:bg-red-600/20';
  const variant = props.variant === 'destructive' ? destructive : normal;
  const alignment = props.align === 'right' ? 'justify-end' : 'justify-between';

  return (
    <footer
      className={cn(
        props.className,
        alignment,
        variant,
        'flex flex-col sm:flex-row border-t p-4 gap-2 items-center'
      )}
    >
      {props.children}
    </footer>
  );
};

export const SettingsCardLabel = ({children}: {children: React.ReactNode}) => (
  <p className="text-sm">{children}</p>
);

export const SettingsCardFooterLabel = ({
  children
}: {children: React.ReactNode}) => (
  <p className="flex flex-row gap-[4px] items-center text-sm text-neutral-600 dark:text-neutral-400">
    {children}
  </p>
);

export default SettingsCard;
