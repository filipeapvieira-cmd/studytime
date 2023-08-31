"use client";

import { fetcher } from "@/lib/swr/utils";
import { FC, useEffect } from "react";
import useSWR from "swr";
import { studySessionDto } from "@/types";
import { GET_ALL_SESSIONS_ENDPOINT } from "@/constants/config";
import { useToast } from "@/components/ui/use-toast";
import BarChartCustom from "@/components/charts/BarChart";

interface ChartsPageProps {}

const ChartsPage: FC<ChartsPageProps> = ({}) => {
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
};

export default ChartsPage;
