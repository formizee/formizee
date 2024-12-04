import {CodeCard} from './code';
import {EmailCard} from './email';
import {ProcessCard} from './process';

export function Cards(): JSX.Element {
  return (
    <div className="relative mt-14 h-[17.5rem] w-full overflow-hidden sm:h-[21rem] md:h-[24.5rem] lg:w-[47.45%] xl:w-[53.5%] 2xl:w-[54%]">
      <div className="absolute mt-4 h-[256px] scale-90 sm:mt-10 sm:scale-100 md:mt-16 lg:mt-10">
        <CodeCard />
        <ProcessCard />
        <EmailCard />
      </div>
    </div>
  );
}

export default Cards;
