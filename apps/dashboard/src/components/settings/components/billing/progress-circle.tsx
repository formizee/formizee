const cleanPercentage = (percentage: number) => {
  const tooLow = !Number.isFinite(+percentage) || percentage < 0;
  const tooHigh = percentage > 100;
  return tooLow ? 0 : tooHigh ? 100 : +percentage;
};

const getColor = (percentage: number) => {
  if (percentage < 50) {
    return 'text-green-400';
  }
  if (percentage < 80) {
    return 'text-amber-400';
  }
  return 'text-red-500';
};

const Circle = (props: {className?: string; percentage: number}) => {
  const r = 8;
  const circ = 2 * Math.PI * r;
  const strokePct = ((100 - props.percentage) * circ) / 100;
  return (
    <circle
      r={r}
      cx={190}
      cy={10}
      fill="transparent"
      strokeWidth={3.5}
      strokeDasharray={circ}
      strokeLinecap="round"
      className={props?.className}
      stroke={strokePct !== circ ? 'currentColor' : ''}
      strokeDashoffset={props.percentage ? strokePct : 0}
    />
  );
};

export const CircleProgress = (props: {percentage: number}) => {
  const pct = cleanPercentage(props.percentage);
  const color = getColor(pct);

  return (
    <svg width={20} height={20}>
      <g transform={`rotate(-90 ${'100 100'})`}>
        <Circle
          className="text-neutral-200 dark:text-neutral-800"
          percentage={100}
        />
        <Circle className={color} percentage={pct} />
      </g>
    </svg>
  );
};
