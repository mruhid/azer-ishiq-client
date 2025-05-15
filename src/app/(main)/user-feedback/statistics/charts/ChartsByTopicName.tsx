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
import { FeedbackStatisticsProps } from "@/lib/type";
import { TrendingUp } from "lucide-react";
import { Pie, PieChart } from "recharts";

interface SecondChartProps {
  data: FeedbackStatisticsProps["byTopic"] | null;
}
const getAppealChartData2 = (data: SecondChartProps["data"]) => {
  if (!data) return [];
  return [
    {
      category: "Human Resources",
      count: data.InsanQaynaqlari,
      fill: "hsl(var(--chart-1))",
    },
    {
      category: "Online Payment Application",
      count: data.OnlaynOdemeMuracieti,
      fill: "hsl(var(--chart-2))",
    },
    {
      category: "Accident",
      count: data.Qeza,
      fill: "hsl(var(--chart-3))",
    },
    {
      category: "Brief Information",
      count: data.QisaMelumat,
      fill: "hsl(var(--chart-4))",
    },
    {
      category: "Complaint",
      count: data.Sikayet,
      fill: "hsl(var(--chart-5))",
    },
  ];
};

const chartConfig2 = {
  count: {
    label: "Topic",
  },
  "Human Resources": {
    label: "Human Resources",
    color: "hsl(var(--chart-1))",
  },
  "Online Payment Application": {
    label: "Online Payment Application",
    color: "hsl(var(--chart-2))",
  },
  Accident: {
    label: "Accident",
    color: "hsl(var(--chart-3))",
  },
  "Brief Information": {
    label: "Brief Information",
    color: "hsl(var(--chart-4))",
  },
  Complaint: {
    label: "Complaint",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export default function ChartsByTopicName({ data }: SecondChartProps) {
  const chartData = getAppealChartData2(data);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Meesages by Topic</CardTitle>
        <CardDescription>All Feedback</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig2}
          className="mx-auto aspect-square max-h-[250px] [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart className="">
            <ChartTooltip content={<ChartTooltipContent hideLabel={false} />} />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="category"
              label
              strokeWidth={5}
              outerRadius={80}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing appeals grouped by topic
        </div>
      </CardFooter>
    </Card>
  );
}
