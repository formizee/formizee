import {LoadingIcon} from '@formizee/ui/icons';
import {Transition} from '../components';

function Loading(): JSX.Element {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-950">
      <Transition className="z-20 flex flex-col px-5">
        <LoadingIcon />
      </Transition>
    </main>
  );
}

export default Loading;
