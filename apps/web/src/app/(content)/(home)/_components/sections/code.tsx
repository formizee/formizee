import {BlurFade} from '@/components/blur-fade';
import {CodeBlock} from '../code-block';

export const Code = () => {
  const now = new Date();
  const hours = now.getHours();
  const day = now.getDay(); // 0 is Sunday, 6 is Saturday

  let timeOfDay: string;

  if (hours >= 5 && hours < 12) {
    timeOfDay = 'this morning';
  } else if (hours >= 12 && hours < 18) {
    timeOfDay = 'this afternoon';
  } else {
    timeOfDay = 'this evening';
  }

  if (day === 0 || day === 6) {
    timeOfDay = 'this weekend';
  }

  return (
    <BlurFade inView className="-mt-4">
      <section className="flex px-4 flex-col items-center justify-center">
        <h3 className="text-neutral-900 dark:text-neutral-50 font-bold text-3xl text-center select-none">
          Integrate {timeOfDay}
        </h3>
        <p className="font-secondary text-sm mt-4 mb-16">
          We provide examples for all use cases
        </p>
        <div className="w-full flex flex-col items-center">
          <CodeBlock />
        </div>
      </section>
    </BlurFade>
  );
};
