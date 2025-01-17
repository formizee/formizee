import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@formizee/ui';
import type {Dispatch, SetStateAction} from 'react';
import {ResumeWidget} from './resume';
import {CalendarIcon} from '@formizee/ui/icons';

interface Props {
  setTimeRange: Dispatch<SetStateAction<string>>;
  timeRangeSubmissions: number;
  totalSubmissions: number;
  timeRange: string;
}

export const ChartHeader = (props: Props) => {
  return (
    <header className="flex items-center gap-2 space-y-0 border-b dark:border-b-neutral-800 py-5 px-2">
      <div className="grid flex-1 gap-1 text-center sm:text-left">
        <ResumeWidget
          timeRange={props.timeRange}
          timeRangeSubmissions={props.timeRangeSubmissions}
          totalSubmissions={props.totalSubmissions}
        />
      </div>
      <Select value={props.timeRange} onValueChange={props.setTimeRange}>
        <SelectTrigger
          className="hidden sm:flex border-2 font-secondary font-semibold w-[170px] gap-2 rounded-lg sm:ml-auto mr-2"
          aria-label="Select a value"
        >
          <CalendarIcon />
          <SelectValue placeholder="Last 3 months" />
        </SelectTrigger>
        <SelectContent className="rounded-xl">
          <SelectItem value="30d" className="rounded-lg">
            Last 30 Days
          </SelectItem>
          <SelectItem value="7d" className="rounded-lg">
            Last 7 Days
          </SelectItem>
          <SelectItem value="1d" className="rounded-lg">
            Last 24 Hours
          </SelectItem>
        </SelectContent>
      </Select>
    </header>
  );
};
