"use client";
import * as React from "react";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

import { useQuery } from "@tanstack/react-query";
import { FeedbackStatisticsProps } from "@/lib/type";
import { fetchQueryFN } from "../../fetchQueryFN";
import { useSession } from "../../SessionProvider";
import MonthValueChart from "./charts/MonthValueChart";
import ChartsByTopicName from "./charts/ChartsByTopicName";
import { ChartsByMessageStatus } from "./charts/ChartsByMessageStatus";
export default function FeedbackCharts() {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/ElectronicAppeal/statistics`;
  const { session } = useSession();
  const {
    data: chartsData,
    isPending,
    isError,
  } = useQuery<FeedbackStatisticsProps>({
    queryKey: ["feedback-charts-statistics"],
    queryFn: fetchQueryFN<FeedbackStatisticsProps>(url, session),
    staleTime: Infinity,
  });

  const chart1Data = chartsData
    ? {
        totalAppeals: chartsData.totalAppeals,
        readAppeals: chartsData.readAppeals,
        unreadAppeals: chartsData.unreadAppeals,
        repliedAppeals: chartsData.repliedAppeals,
        notRepliedAppeals: chartsData.notRepliedAppeals,
      }
    : null;
  const chart2Data = chartsData ? chartsData.byTopic : null;

  return (
    <div className="mx-2 w-full">
      {isError ? (
        <Card className="flex h-full min-h-[250px] items-center justify-center">
          <p className="font-medium text-destructive">Something went wrong.</p>
        </Card>
      ) : isPending ? (
        <Card className="flex h-full min-h-[250px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <ChartsByMessageStatus data={chart1Data} />
          <ChartsByTopicName data={chart2Data} />
          <MonthValueChart data={chartsData?.monthlyAppeals} />
        </div>
      )}
    </div>
  );
}
