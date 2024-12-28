'use client';

import {Bar, BarChart, CartesianGrid, XAxis, YAxis} from 'recharts';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@formizee/ui';

function generateChartData() {
  const chartData = [];
  const currentDate = new Date();

  for (let i = 0; i < 30; i++) {
    const dateTime = new Date(currentDate);
    dateTime.setDate(currentDate.getDate() - i); // Subtract days
    const formattedDate = dateTime.toISOString().split('T')[0]; // Format to YYYY-MM-DD

    chartData.push({
      dateTime: formattedDate,
      submissions: Math.floor(Math.random() * 100) // Random submissions between 0-99
    });
  }

  return chartData;
}

const chartConfig = {
  submissions: {
    label: 'Submissions',
    color: 'hsl(var(--chart-1))'
  }
} satisfies ChartConfig;

export const Analytics = () => {
  const chartData = generateChartData();

  return (
    <article className="relative flex flex-row w-full max-w-96 sm:max-w-[36rem] h-80 overlflow-hidden rounded-lg border dark:border-neutral-800 pt-0 pb-48 sm:pb-40 sm:pt-8 md:pb-60 shadow-sm">
      <div className="flex flex-col w-full items-center justify-center absolute top-6">
        <h4 className="text-2xl font-bold">Analytics</h4>
        <p className="font-secondary font-medium text-neutral-400 dark:text-neutral-600 mt-2 text-md">
          Realtime insights of your data
        </p>
      </div>
      <div className="flex h-48 mt-28 sm:mt-20 pr-4 w-full">
        <ChartContainer
          config={chartConfig}
          className="animate-fade-in aspect-auto h-48 w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            tabIndex={-1}
            margin={{
              left: 0,
              right: 0
            }}
          >
            <CartesianGrid vertical={false} strokeOpacity={0.4} />
            <XAxis
              dataKey="dateTime"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={value => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                });
              }}
            />
            <YAxis
              dataKey="submissions"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              allowDecimals={false}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  hideIndicator
                  className="w-[150px]"
                  nameKey="submissions"
                  labelFormatter={value => {
                    const date = new Date(value);
                    return date.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    });
                  }}
                />
              }
            />
            <Bar
              radius={[2, 2, 0, 0]}
              dataKey="submissions"
              className={'fill-neutral-950 dark:fill-neutral-50'}
            />
          </BarChart>
        </ChartContainer>
      </div>
    </article>
  );
};
