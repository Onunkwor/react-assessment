"use client";

import { TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  Dot,
  Line,
  LineChart,
  Tooltip,
  type TooltipProps,
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

// Define explicit colors
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

// Main line color
const LINE_COLOR = "#3b82f6"; // blue

export interface TopRatedDataItem {
  name: string;
  rating: number;
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
        <p className="text-sm text-muted-foreground">Rating: {data.rating}</p>
      </div>
    );
  }
  return null;
};

export function LineChartComponent({
  topRatedData,
}: {
  topRatedData: TopRatedDataItem[];
}) {
  // Add colors to the data
  const chartData = topRatedData.map((item, index) => ({
    ...item,
    fill: CHART_COLORS[index % CHART_COLORS.length],
  }));

  // Create a dynamic chartConfig based on the data
  const dynamicChartConfig: ChartConfig = {
    rating: {
      label: "Rating",
      color: LINE_COLOR,
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
        <CardTitle>Top Rated Movies (January - June 2024)</CardTitle>
        <CardDescription>
          A visual representation of the highest-rated movies from the first
          half of 2024, based on audience and critic scores
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={dynamicChartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 24,
              left: 24,
              right: 24,
            }}
          >
            <CartesianGrid vertical={false} />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Line
              dataKey="rating"
              type="natural"
              stroke={LINE_COLOR}
              strokeWidth={2}
              dot={({ payload, cx, cy }) => {
                return (
                  <Dot
                    key={payload.name}
                    r={5}
                    cx={cx}
                    cy={cy}
                    fill={payload.fill}
                    stroke={payload.fill}
                  />
                );
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Average ratings have increased by 5.2% this month{" "}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Displaying top-rated movies over the last six months.
        </div>
      </CardFooter>
    </Card>
  );
}
