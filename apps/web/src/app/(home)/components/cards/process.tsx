import {Card} from '@formizee/ui';

export function ProcessCard(): JSX.Element {
  return (
    <Card
      className="relative z-20 p-0 h-[216px] flex flex-row translate-x-[100px] translate-y-[-190px] items-center justify-evenly"
      size="landing"
      variant="landing">
      <div className="fixed top-20 h-[2px] w-full bg-neutral-700"/>
    </Card>
  );
}

export default ProcessCard;
