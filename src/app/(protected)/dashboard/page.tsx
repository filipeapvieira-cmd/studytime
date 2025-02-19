"use client";

import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useUserStudySessions } from "@/src/hooks/new/useUserStudySessions";
import { useErrorToast } from "@/src/hooks/new/useErrorToast";
import TableSkeleton from "@/src/components/skeletons/TableSkeleton";

const DashboardPage = () => {
  const { data, isLoading, error } = useUserStudySessions();

  useErrorToast(
    error,
    "Unable to fetch data for dashboard. Please try again later."
  );

  if (isLoading) return <TableSkeleton />;

  return (
    <div className="max-w-6xl md:min-w-[1000px] w-4/5 mx-auto py-10 px-4">
      <DataTable columns={columns} data={data || []} />
    </div>
  );
};

export default DashboardPage;
