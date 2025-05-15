import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";

const getMonthlyAppealsChartData = (data: Record<string, number>) => {
  return Object.entries(data)
    .sort(
      ([a], [b]) =>
        new Date(`${a}-01`).getTime() - new Date(`${b}-01`).getTime(),
    )
    .map(([dateStr, count]) => {
      const date = new Date(`${dateStr}-01`);
      const monthLabel = date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });

      return {
        month: monthLabel,
        appeals: count,
      };
    });
};

interface AppealsLineChartProps {
  data: Record<string, number> | undefined;
}

export default function MonthValueChart({ data }: AppealsLineChartProps) {
  if (!data) {
    return null;
  }
  const chartData = getMonthlyAppealsChartData(data);

  const chartConfig = {
    appeals: {
      label: "Appeals",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Appeals</CardTitle>
        <CardDescription>Automatically generated per month</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="appeals"
              type="natural"
              stroke="var(--color-appeals)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-appeals)",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by{" "}
          {chartData.length > 1
            ? Math.round(
                ((chartData.at(-1)!.appeals - chartData.at(-2)!.appeals) /
                  chartData.at(-2)!.appeals) *
                  100,
              )
            : 0}
          % this month
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total operation from {chartData[0]?.month} to{" "}
          {chartData.at(-1)?.month}
        </div>
      </CardFooter>
    </Card>
  );
}
