"use client";

import { fetcher } from "@/src/lib/swr/utils";
import { FC, useEffect } from "react";
import useSWR from "swr";
import { studySessionDto } from "@/src/types";
import { GET_ALL_SESSIONS_ENDPOINT } from "@/src/constants/config";
import { useToast } from "@/src/components/ui/use-toast";
import BarChartCustom from "@/src/components/charts/BarChart";
import { Metadata } from "next";

//TODO: Verify if this Page should not be "use client";
const metadata: Metadata = {
  title: "📊 Charts",
};

function ChartsPage() {
  const { data, error } = useSWR(GET_ALL_SESSIONS_ENDPOINT, fetcher);
  const { toast } = useToast();

  //TODO: code repeated with dashboard page. Needs to be refactored!
  useEffect(() => {
    if (!error) return;
    toast({
      variant: "destructive",
      title: `Uh oh! Something went wrong`,
      description: `Unable to fetch data. Please try again later`,
    });
  }, [error]);

  if (!data || error) return;

  const { data: extractedData }: { data: studySessionDto[] } = data;

  return (
    <div className="container mx-auto">
      <BarChartCustom studySessions={extractedData} />
    </div>
  );
}

export default ChartsPage;
