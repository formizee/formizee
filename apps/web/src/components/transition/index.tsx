import {cn} from '@formizee/ui';

interface TransitionProps {
  className?: string;
  children: React.ReactNode;
}

export function Transition(props: TransitionProps): React.JSX.Element {
  return (
    <div className={cn('animate-fade-in', props.className)}>
      {props.children}
    </div>
  );
}

export default Transition;
