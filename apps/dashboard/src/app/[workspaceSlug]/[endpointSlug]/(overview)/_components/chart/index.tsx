'use client';

import {Bar, BarChart, CartesianGrid, XAxis, YAxis} from 'recharts';
import {LoadingSkeleton} from './skeleton';
import {ChartHeader} from './header';
import {ChartError} from './error';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  cn
} from '@formizee/ui';

import {countTimeRangeSubmissions, filterDataByTimeRange} from './helpers';
import {type Color, getColor} from '@/lib/colors';
import {chartConfig} from './config';
import {api} from '@/trpc/client';
import {useState} from 'react';

interface Props {
  id: string;
  color: Color;
}

export function Chart({id, color}: Props) {
  const {data, isLoading, error} = api.endpoint.getMetrics.useQuery({id});
  const [timeRange, setTimeRange] = useState('30d');

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ChartError />;
  }
  const timeRangeSubmissions = countTimeRangeSubmissions(data, timeRange);
  const filteredData = filterDataByTimeRange(data, timeRange);

  return (
    <section className="rounded-md border dark:border-neutral-800 w-full mt-4">
      <ChartHeader
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        totalSubmissions={data.totalSubmissions}
        timeRangeSubmissions={timeRangeSubmissions}
      />
      <div className="px-2 pt-4 sm:px-6 sm:pt-6 w-full">
        <ChartContainer
          config={chartConfig}
          className="animate-fade-in aspect-auto h-[450px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={filteredData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <CartesianGrid vertical={false} strokeOpacity={0.4} />
            <XAxis
              className="dark:border-red-400"
              dataKey="dateTime"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={value => {
                const date = new Date(value);
                if (timeRange === '1d') {
                  return date.toLocaleString('en-US', {
                    hour: '2-digit'
                  });
                }
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
                  nameKey="Submissions"
                  labelFormatter={value => {
                    const date = new Date(value);
                    if (timeRange === '1d') {
                      return date.toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric'
                      });
                    }
                    return date.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    });
                  }}
                />
              }
            />
            <Bar
              radius={4}
              dataKey="submissions"
              className={cn(getColor(color, true).fill)}
            />
          </BarChart>
        </ChartContainer>
      </div>
    </section>
  );
}
