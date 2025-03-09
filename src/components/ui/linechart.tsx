"use client";

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
        <CardTitle>Top Rated Movies </CardTitle>
        <CardDescription>
          A visual representation of the highest-rated movies based on audience
          and critic scores
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

        {/* 🔥 Added legend under the chart */}
        <div className="flex flex-wrap justify-center gap-4">
          {chartData.map((movie, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: movie.fill }}
              />
              <span className="text-sm text-muted-foreground">
                {movie.name}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
