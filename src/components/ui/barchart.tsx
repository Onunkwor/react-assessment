"use client";

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Tooltip,
  type TooltipProps,
  XAxis,
  YAxis,
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

// Custom hook for responsive design
function useResponsiveLayout() {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    // Function to check if screen is small
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768); // 768px is typical md breakpoint
    };

    // Initial check
    checkScreenSize();

    // Add event listener for resize
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return isSmallScreen;
}

export function BarChartComponent({
  genreData,
}: {
  genreData: GenreDataItem[];
}) {
  const isSmallScreen = useResponsiveLayout();

  // Add colors to the data
  const chartData = genreData.map((item, index) => ({
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

  // Sort data by value for horizontal bar chart (optional)
  const sortedData = isSmallScreen
    ? [...chartData].sort((a, b) => b.value - a.value)
    : chartData;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Genre Distribution</CardTitle>
        <CardDescription>Movie Genres</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={dynamicChartConfig}>
          {isSmallScreen ? (
            // Horizontal bar chart for small screens
            <BarChart
              accessibilityLayer
              data={sortedData}
              layout="vertical"
              margin={{ top: 10, right: 10, left: 80, bottom: 10 }}
              height={Math.max(300, sortedData.length * 40)} // Dynamic height based on number of items
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="name"
                type="category"
                width={70}
                axisLine={false}
                tickLine={false}
              />
              <XAxis type="number" axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={false} />
              <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                {sortedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          ) : (
            // Vertical bar chart for larger screens
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{ top: 10, right: 10, left: 10, bottom: 70 }}
              height={400}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={25}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                height={60}
                interval={0}
              />
              <Tooltip content={<CustomTooltip />} cursor={false} />
              <Bar dataKey="value" radius={8}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          )}
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
