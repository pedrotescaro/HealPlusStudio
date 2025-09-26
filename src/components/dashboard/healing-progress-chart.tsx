'use client';
import {Bar, BarChart, CartesianGrid, XAxis, YAxis} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '../ui/chart';

const chartData = [
  {month: 'January', new: 18, healed: 12},
  {month: 'February', new: 30, healed: 22},
  {month: 'March', new: 20, healed: 25},
  {month: 'April', new: 27, healed: 19},
  {month: 'May', new: 18, healed: 23},
  {month: 'June', new: 32, healed: 28},
];

const chartConfig = {
  healed: {
    label: 'Healed',
    color: 'hsl(var(--chart-2))',
  },
  new: {
    label: 'New',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function HealingProgressChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={value => `${value}`}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Bar
          dataKey="healed"
          fill="var(--color-healed)"
          radius={[4, 4, 0, 0]}
        />
        <Bar dataKey="new" fill="var(--color-new)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
}
