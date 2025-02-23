"use client";

import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useUserStudySessions } from "@/src/hooks/new/useUserStudySessions";
import { useErrorToast } from "@/src/hooks/new/useErrorToast";
import TableSkeleton from "@/src/components/skeletons/TableSkeleton";
import UnexpectedEvent from "@/src/components/Unexpected-Event";
import { cn } from "@/src/lib/utils";

const unexpectedEventConfig = {
  header: "No study sessions found",
  message:
    "It looks like you haven't logged any sessions yet. Start by adding your first study session to track your progress!",
};

const DashboardPage = () => {
  const { data, isLoading, error } = useUserStudySessions();

  useErrorToast(
    error,
    "Unable to fetch data for dashboard. Please try again later."
  );

  if (isLoading) return <TableSkeleton />;

  return (
    <div
      className={cn(`max-w-6xl w-4/5 mx-auto`, data?.length && "py-10 px-4")}
    >
      {!data?.length ? (
        <UnexpectedEvent config={unexpectedEventConfig} />
      ) : (
        <DataTable columns={columns} data={data || []} />
      )}
    </div>
  );
};

export default DashboardPage;
