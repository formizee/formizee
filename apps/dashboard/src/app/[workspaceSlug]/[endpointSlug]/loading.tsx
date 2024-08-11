import {LoadingIcon} from '@formizee/ui/icons';
import {Transition} from '@/components';

function Loading(): JSX.Element {
  return (
    <main className="w-full flex flex-col min-h-screen gap-4 items-center justify-center p-24">
      <Transition className="flex flex-col max-w-[50rem] gap-4">
        <LoadingIcon />
      </Transition>
    </main>
  );
}

export default Loading;
