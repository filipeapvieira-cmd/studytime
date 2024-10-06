import { getStudySessionsByUserId } from "@/src/data/study-sessions";
import { Suspense } from "react";
import TableSkeleton from "@/src/components/skeletons/TableSkeleton";
import { DataTable } from "./data-table";
import { columns } from "./columns";

async function DashboardPage() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <DashboardData />
    </Suspense>
  );
}

export default DashboardPage;

async function DashboardData() {
  const response = await getStudySessionsByUserId();
  const { data, status } = response;

  if (status === "error") {
    throw new Error(response.message);
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
