import {cn} from '@formizee/ui';

interface HeadingProps {
  children: React.ReactNode;
  className?: string;
}

export const Heading = (props: HeadingProps) => {
  return (
    <h1
      className={cn(
        props.className,
        'leading-tight bg-gradient-to-b from-slate-500 to-black dark:from-white dark:to-slate-400 bg-clip-text font-bold text-[2.25rem] text-transparent'
      )}
    >
      {props.children}
    </h1>
  );
};

export default Heading;
