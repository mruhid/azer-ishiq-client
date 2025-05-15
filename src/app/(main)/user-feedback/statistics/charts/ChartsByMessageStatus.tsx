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
import { Cell, Label, Pie, PieChart } from "recharts";
interface FirstChartProps {
  data: {
    totalAppeals: number;
    readAppeals: number;
    unreadAppeals: number;
    repliedAppeals: number;
    notRepliedAppeals: number;
  } | null;
}

const getAppealChartData = (data: FirstChartProps["data"]) => {
  if (!data) return [];
  return [
    {
      category: "Read",
      count: data.readAppeals,
      fill: "hsl(var(--primary))",
    },
    {
      category: "Unread",
      count: data.unreadAppeals,
      fill: "hsl(var(--destructive))",
    },
    {
      category: "Replied",
      count: data.repliedAppeals,
      fill: "hsl(var(--chart-3))",
    },
    {
      category: "Not Replied",
      count: data.notRepliedAppeals,
      fill: "hsl(var(--chart-4))",
    },
  ];
};

const chartConfig = {
  count: {
    label: "Appeals",
  },
  Read: {
    label: "Read",
    color: "hsl(var(--chart-2))",
  },
  Unread: {
    label: "Unread",
    color: "hsl(var(--destructive))",
  },
  Replied: {
    label: "Replied",
    color: "hsl(var(--chart-3))",
  },
  "Not Replied": {
    label: "Not Replied",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export function ChartsByMessageStatus({ data }: FirstChartProps) {
  const totalAppeals = data?.totalAppeals ?? 0;
  const chartData = getAppealChartData(data);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Feedback messages</CardTitle>
        <CardDescription>Current Messages Statistics</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="category"
              innerRadius={40}
              outerRadius={80}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox))
                    return null;

                  const cx = viewBox.cx;
                  const cy = viewBox.cy;

                  return (
                    <text
                      x={cx}
                      y={cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={cx}
                        y={cy}
                        className="fill-foreground text-3xl font-bold"
                      >
                        {totalAppeals.toLocaleString()}
                      </tspan>
                      <tspan
                        x={cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        Feedback
                      </tspan>
                    </text>
                  );
                }}
              />

              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Statistics all messages <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total appeals for the last period
        </div>
      </CardFooter>
    </Card>
  );
}
