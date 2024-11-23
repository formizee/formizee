interface Props {
  timeRange: string;
  timeRangeSubmissions: number;
  totalSubmissions: number;
}

export const ResumeWidget = (props: Props) => {
  const timeRangeText = () => {
    switch (props.timeRange) {
      case '7d':
        return 'On This Week';
      case '1d':
        return 'Today';
      default:
        return 'On This Month';
    }
  };

  return (
    <div className="flex flex-row justify-between w-full max-w-[450px]">
      <div className="flex flex-col flex-1 px-2 items-start border-r dark:border-r-neutral-800">
        <span className="text-sm text-neutral-600 dark:text-neutral-400">
          Total Submissions
        </span>
        <span className="text-xl font-bold">
          {props.totalSubmissions.toLocaleString()}
        </span>
      </div>
      <div className="flex flex-col flex-1 pl-4 items-start">
        <span className="text-sm text-neutral-600 dark:text-neutral-400">
          {timeRangeText()}
        </span>
        <span className="text-xl font-bold">
          {props.timeRangeSubmissions.toLocaleString()}
        </span>
      </div>
    </div>
  );
};
