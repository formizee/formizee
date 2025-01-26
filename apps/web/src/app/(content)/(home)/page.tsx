import {Join, Comparations, Bentos, Features} from './_components/sections';
import {WaitlistDialog} from '@/components/waitlist-dialog';
import {Code} from './_components/sections/code';
import {Showcase} from './_components/showcase';
import {LaunchBanner} from '@/components/banner';
import {GithubLabel} from './_components/github';
import {BlurFade} from '@/components/blur-fade';
import {showWaitlist} from '@/flags';
import {Button} from '@formizee/ui';
import Link from 'next/link';

async function Home() {
  const waitlist = await showWaitlist();

  return (
    <main className="relative flex flex-col min-h-screen gap-32">
      {waitlist ? (
        <LaunchBanner>✨ Public Beta available the 29 of January!</LaunchBanner>
      ) : (
        <div />
      )}
      <header className="flex flex-col items-center">
        <BlurFade>
          <div className="flex flex-col gap-8 items-center mt-40 sm:mt-48">
            <GithubLabel />
            <h1 className="text-neutral-900 dark:text-neutral-50 font-bold text-[2.25rem] leading-tight sm:text-[3rem] text-center">
              The Open-Source
              <br />
              Forms Platform
            </h1>
            <h2 className="font-secondary text-neutral-800 text-sm sm:text-md dark:text-neutral-200 max-w-[430px] text-center">
              Formizee is the modern approach to create forms.
              <br />
              Design, build and analytics all at an affordable price,
              <br />
              all-in-one solution
            </h2>
            {waitlist ? (
              <WaitlistDialog>
                <Button className="max-w-40 mt-4 font-secondary border-2 hover:border-neutral-500 dark:hover:border-neutral-400 hover:bg-neutral-800 dark:hover:bg-neutral-300 border-neutral-700 dark:border-neutral-300 bg-neutral-900 dark:bg-neutral-100">
                  Join Beta Waitlist
                </Button>
              </WaitlistDialog>
            ) : (
              <Button
                asChild
                className="max-w-32 mt-4 font-secondary border-2 hover:border-neutral-500 dark:hover:border-neutral-400 hover:bg-neutral-800 dark:hover:bg-neutral-300 border-neutral-700 dark:border-neutral-300 bg-neutral-900 dark:bg-neutral-100"
              >
                <Link href="https://dashboard.formizee.com">Get Started</Link>
              </Button>
            )}
          </div>
        </BlurFade>
        <Showcase />
      </header>
      <Code />
      <Bentos />
      <Comparations />
      <Features />
      <Join />
    </main>
  );
}

export default Home;
