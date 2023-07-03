"use client";

import { FC, useEffect, useRef, useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import useSWR from "swr";
import TableSkeleton from "@/components/skeletons/TableSkeleton";
import { useToast } from "@/components/ui/use-toast";

interface DashboardPageProps {}

const fetcher = async (url: string) => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

const DashboardPage: FC<DashboardPageProps> = ({}) => {
  const { data, error } = useSWR("/api/session/get/sessions", fetcher);
  const { toast } = useToast();

  useEffect(() => {
    if (!error) return;
    toast({
      variant: "destructive",
      title: `Uh oh! Something went wrong`,
      description: `Unable to fetch data. Please try again later`,
    });
  }, [error]);

  if (error) {
    console.log(error.message);
  }

  if (!data || error) return <TableSkeleton />;

  const { data: extractedData } = data;

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={extractedData} />
    </div>
  );
};

export default DashboardPage;
