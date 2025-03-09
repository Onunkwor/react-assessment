"use client";

import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip,
  type TooltipProps,
  XAxis,
} from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";

// Define explicit colors for different bars
const CHART_COLORS = [
  "#3b82f6", // blue
  "#ef4444", // red
  "#10b981", // green
  "#f59e0b", // amber
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#f97316", // orange
];

export interface GenreDataItem {
  name: string;
  value: number;
}

// Custom tooltip component
const CustomTooltip = ({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <p className="font-medium">{data.name}</p>
        <p className="text-sm text-muted-foreground">Count: {data.value}</p>
      </div>
    );
  }
  return null;
};

export function BarChartComponent({
  genreData,
}: {
  genreData: GenreDataItem[];
}) {
  // Add colors to the data
  const chartData = genreData.slice(0, 7).map((item, index) => ({
    ...item,
    fill: CHART_COLORS[index % CHART_COLORS.length],
  }));

  // Create a dynamic chartConfig based on the data
  const dynamicChartConfig: ChartConfig = {
    value: {
      label: "Count",
      color: CHART_COLORS[0],
    },
    ...Object.fromEntries(
      chartData.map((item, index) => [
        item.name,
        {
          label: item.name,
          color: CHART_COLORS[index % CHART_COLORS.length],
        },
      ])
    ),
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Genre Distribution</CardTitle>
        <CardDescription>Movie Genres</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={dynamicChartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: 10,
              bottom: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              // Limit long genre names to first 10 characters
              tickFormatter={(value) =>
                value.length > 10 ? `${value.slice(0, 10)}...` : value
              }
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Bar dataKey="value" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Most popular genres <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing distribution of movies by genre
        </div>
      </CardFooter>
    </Card>
  );
}
