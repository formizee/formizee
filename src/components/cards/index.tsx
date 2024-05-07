import {Card} from '@/components/ui';
import {EmailCard} from './email';
import {CodeCard} from './code';

export const FormCard = () => {
  return (
    <Card className="relative z-20 translate-x-[100px] translate-y-[-170px]">
      Form
    </Card>
  );
};

export const Cards = () => {
  return (
    <div className="relative mt-20 h-72 w-full overflow-x-clip sm:h-80 md:h-96 lg:w-1/2 xl:w-[55%] 2xl:w-[55%]">
      <div className="absolute mt-5 h-[256px] scale-90 sm:mt-10 sm:scale-100 md:mt-16 lg:mt-10">
        <CodeCard />
        <FormCard />
        <EmailCard />
      </div>
    </div>
  );
};

export default Cards;
