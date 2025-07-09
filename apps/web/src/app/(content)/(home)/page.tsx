import {Join, Comparations, Bentos, Features} from './_components/sections';
import {Code} from './_components/sections/code';
import {Showcase} from './_components/showcase';
import {GithubLabel} from './_components/github';
import {BlurFade} from '@/components/blur-fade';
import {Button} from '@formizee/ui';
import Link from 'next/link';
import {BookIcon} from '@formizee/ui/icons';

async function Home() {
  return (
    <main className="relative flex flex-col min-h-screen gap-32">
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
                  href="https://docs.formizee.com"
                  className="flex flex-row gap-3"
                  target="_blank"
                >
                  <span>Documentation</span>
                </Link>
              </Button>
            </div>
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
