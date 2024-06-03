import {Card} from '@formizee/ui';

export function ProcessCard(): JSX.Element {
  return (
    <Card
      className="z-20 h-[216px] translate-x-[100px] translate-y-[-190px]"
      size="landing"
      variant="landing">
      <div className="relative flex flex-row items-center justify-evenly p-0 ">
        <div className="fixed top-20 h-[2px] w-full bg-neutral-700" />
      </div>
    </Card>
  );
}

export default ProcessCard;
