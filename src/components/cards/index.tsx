import {Card} from '@/components/ui';
export const CodeCard = () => {
  return <Card className="relative z-30 shadow-card">Code</Card>;
};

export const FormCard = () => {
  return (
    <Card className="relative translate-y-[-170px] translate-x-[20px] z-20">
      Form
    </Card>
  );
};

export const EmailCard = () => {
  return (
    <Card className="relative translate-y-[-340px] translate-x-[40px] z-10">
      Email
    </Card>
  );
};

export const Cards = () => {
  return (
    <div className="overflow-clip absolute mt-5 right-0 w-[45%] h-[256px]">
      <CodeCard />
      <FormCard />
      <EmailCard />
    </div>
  );
};

export default Cards;
