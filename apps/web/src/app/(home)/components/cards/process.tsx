import {Card} from '@formizee/ui';

export function ProcessCard(): JSX.Element {
  return (
    <Card
      className="z-20 h-[216px] translate-x-[100px] translate-y-[-190px]"
      size="landing"
      variant="landing">
      <div className="relative flex p-0 flex-row items-center justify-evenly ">
        <div className="fixed top-20 h-[2px] w-full bg-neutral-700"/>
      </div>
    </Card>
  );
}

export default ProcessCard;
