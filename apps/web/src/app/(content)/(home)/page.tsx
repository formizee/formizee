import {Join, Comparations, Bentos, Features} from './_components/sections';
import {WaitlistDialog} from '@/components/waitlist-dialog';
import {Code} from './_components/sections/code';
import {Showcase} from './_components/showcase';
import {LaunchBanner} from '@/components/banner';
import {GithubLabel} from './_components/github';
import {BlurFade} from '@/components/blur-fade';
import {getProductHuntVotes} from './actions';
import {showWaitlist} from '@/flags';
import {Button} from '@formizee/ui';
import Link from 'next/link';

async function Home() {
  const votes = await getProductHuntVotes();
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
              <div className="flex flex-row items-center gap-4">
                <Button
                  asChild
                  className="max-w-32 mt-4 font-secondary border-2 hover:border-neutral-500 dark:hover:border-neutral-400 hover:bg-neutral-800 dark:hover:bg-neutral-300 border-neutral-700 dark:border-neutral-300 bg-neutral-900 dark:bg-neutral-100"
                >
                  <Link href="https://dashboard.formizee.com">Get Started</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="group w-full max-w-40 mt-4 font-secondary"
                >
                  <Link
                    href="https://www.producthunt.com/products/formizee"
                    className="flex flex-row gap-3"
                    target="_blank"
                  >
                    <span>Product Hunt</span>
                    <div className="relative flex items-center justify-center">
                      <span className="origin-top transition-all group-hover:scale-y-0 text-neutral-400 dark:text-neutral-600 font-bold">
                        {votes}
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        className="origin-bottom absolute transition-all group-hover:scale-y-100 scale-y-0 size-4"
                      >
                        <path d="M6.579 3.467c.71-1.067 2.132-1.067 2.842 0L12.975 8.8c.878 1.318.043 3.2-1.422 3.2H4.447c-1.464 0-2.3-1.882-1.422-3.2z" />
                      </svg>
                    </div>
                  </Link>
                </Button>
              </div>
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
