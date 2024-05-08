import {ProcessCard} from './process';
import {EmailCard} from './email';
import {CodeCard} from './code';

export const Cards = () => {
  return (
    <div className="relative mt-20 h-72 w-full transform-gpu overflow-x-clip sm:h-80 md:h-96 lg:w-1/2 xl:w-[55%] 2xl:w-[55%]">
      <div className="absolute mt-5 h-[256px] scale-90 sm:mt-10 sm:scale-100 md:mt-16 lg:mt-10">
        <CodeCard />
        <ProcessCard />
        <EmailCard />
      </div>
    </div>
  );
};

export default Cards;
