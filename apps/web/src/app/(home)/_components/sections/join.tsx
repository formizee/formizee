import {BlurFade} from '@/components/blur-fade';
import {Button} from '@formizee/ui';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const Metrics = dynamic(async () => await import("../metrics"));

export const Join = () => {
  return (
    <BlurFade inView className="flex flex-col w-full items-center mb-8">
      <svg
        width="495"
        height="495"
        fill="none"
        viewBox="0 0 495 495"
        className="absolute inset-x-0 w-full mx-auto pointer-events-none -bottom-80 opacity-40 hidden dark:flex"
      >
        <circle
          cx="247.5"
          cy="247.5"
          r="247.5"
          fill="url(#paint0_radial_328_69)"
        />
        <defs>
          <radialGradient
            id="paint0_radial_328_69"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(247.5 247.5) rotate(90) scale(247.5)"
          >
            <stop stopColor="#D9D9D9" stopOpacity="0.44" />
            <stop offset="1" stopColor="#737373" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
      <section className="flex w-full px-4 flex-col md:flex-row items-center justify-center sm:justify-between max-w-[62rem]">
        <div className="flex flex-col items-start">
          <h3 className="text-nowrap text-neutral-900 dark:text-neutral-50 font-bold text-3xl text-center select-none">
            Start Building Today
          </h3>
          <h2 className="w-full font-secondary text-center md:text-start text-sm leading-relaxed mt-4">
            <span className="font-bold">250 Submissions</span> per month for
            free.
            <br />
            No Credit Card Required
          </h2>
          <div className="flex w-full justify-center md:justify-start items-center sm:flex-row gap-4 mt-8">
            <Button
              asChild
              className="max-w-38 font-secondary border-2 hover:border-neutral-500 dark:hover:border-neutral-400 hover:bg-neutral-800 dark:hover:bg-neutral-300 border-neutral-700 dark:border-neutral-300 bg-neutral-900 dark:bg-neutral-100"
            >
              <Link href="https://dashboard.formizee.com">Start Now</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="max-w-38 h-[2.4rem] border-2 font-secondary"
            >
              <Link href="mailto:support@formizee.com">Contact Us</Link>
            </Button>
          </div>
        </div>
        <Metrics />
      </section>
    </BlurFade>
  );
};
