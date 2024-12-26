import {BlurFade} from '@/components/blur-fade';
import {Integrations} from '../integrations';
import {Encryption} from '../encryption';
import {Analytics} from '../analytics';
import {Global} from '../global';

export const Bentos = () => {
  return (
    <BlurFade inView>
      <section className="flex px-4 flex-col items-center justify-center">
        <h3 className="text-neutral-900 dark:text-neutral-50 font-bold text-3xl text-center select-none">
          Built By Developers For Developers
        </h3>
        <h2 className="font-secondary text-sm mt-4 mb-16">
          Because new tech stacks are always exciting
        </h2>
        <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-8">
          <Analytics />
          <Integrations />
        </div>
        <div className="w-full flex flex-col sm:flex-row items-center justify-center mt-8 gap-8">
          <Global />
          <Encryption />
        </div>
      </section>
    </BlurFade>
  );
};
