"use client";

import { FC, useEffect, useRef, useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import useSWR from "swr";
import TableSkeleton from "@/components/skeletons/TableSkeleton";
import { useToast } from "@/components/ui/use-toast";
import { GET_ALL_SESSIONS_ENDPOINT } from "@/constants/config";
import { studySessionDto } from "@/types";
import { fetcher } from "@/lib/swr/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "📋 Dashboard",
};

function DashboardPage() {
  const { data, error } = useSWR(GET_ALL_SESSIONS_ENDPOINT, fetcher);
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

  const { data: extractedData }: { data: studySessionDto[] } = data;

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={extractedData || []} />
    </div>
  );
}

export default DashboardPage;
