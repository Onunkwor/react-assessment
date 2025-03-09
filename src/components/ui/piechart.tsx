"use client";

import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

export interface TrendingDataItem {
  name: string;
  value: number;
  fill?: string;
}

// Replace the dynamic chart config and add explicit colors
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

export function PieChartComponent({
  trendingData,
}: {
  trendingData: TrendingDataItem[];
}) {
  // Add fill colors to the data if not provided
  const chartData = trendingData.map((item, index) => ({
    ...item,
    fill: item.fill || CHART_COLORS[index % CHART_COLORS.length],
  }));

  // Create a dynamic chartConfig based on trendingData with explicit colors
  const dynamicChartConfig: ChartConfig = {
    value: {
      label: "Value",
    },
    ...Object.fromEntries(
      chartData.map((item, index) => [
        item.name,
        {
          label: item.name,
          color: item.fill || CHART_COLORS[index % CHART_COLORS.length],
        },
      ])
    ),
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Trending Movies</CardTitle>
        <CardDescription>
          A breakdown of the most trending movies
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={dynamicChartConfig}
          className="mx-auto w-full max-w-[400px] aspect-square"
        >
          <PieChart>
            <Pie data={chartData} dataKey="value" />
            <ChartLegend
              content={<ChartLegendContent nameKey="name" />}
              className="grid grid-cols-2 gap-x-6 gap-y-2 justify-items-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
