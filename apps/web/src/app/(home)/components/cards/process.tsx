import {Card} from '@/components/ui';

export function ProcessCard() {
  return (
    <Card
      className="relative z-20 flex translate-x-[100px] translate-y-[-170px] items-center justify-center"
      size="landing"
      variant="landing">
      Processing...
    </Card>
  );
}

export default ProcessCard;
