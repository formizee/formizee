import {Card} from '@/components/ui';
import {EmailCard} from './email';
import {CodeCard} from './code';

export const FormCard = () => {
  return (
    <Card className="relative translate-y-[-170px] translate-x-[100px] z-20">
      Form
    </Card>
  );
};

export const Cards = () => {
  return (
    <div className="overflow-x-clip relative mt-20 sm:h-80 md:h-96 w-full h-72 lg:w-1/2 xl:w-[55%] 2xl:w-[55%]">
      <div className="absolute scale-90 sm:scale-100 mt-5 sm:mt-10 md:mt-16 lg:mt-10 h-[256px]">
        <CodeCard />
        <FormCard />
        <EmailCard />
      </div>
    </div>
  );
};

export default Cards;
