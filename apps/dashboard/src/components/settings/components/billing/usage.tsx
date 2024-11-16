import {CircleProgress} from '@/components/progress-circle';
import type {Limits} from '@formizee/plans';
import {Label} from '@formizee/ui';

interface Props {
  currentPlanLimits: Limits;
  children: React.ReactNode;
  planFeature: keyof Limits;
  usage: number;
}

export const UsageWidget = (props: Props) => {
  return (
    <div className="flex justify-between items-end gap-2 mt-4">
      <Label className="text-sm">{props.children}</Label>
      <Label className="flex flex-row gap-2 text-sm">
        {typeof props.currentPlanLimits[props.planFeature] === 'number' ? (
          <>
            <span>
              {props.usage} /{' '}
              {props.currentPlanLimits[props.planFeature].toLocaleString()}
            </span>
            <CircleProgress
              percentage={
                (props.usage /
                  Number(props.currentPlanLimits[props.planFeature])) *
                100
              }
            />
          </>
        ) : (
          <span>Unlimited</span>
        )}
      </Label>
    </div>
  );
};