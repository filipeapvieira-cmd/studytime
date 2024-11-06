import { Skeleton } from "@/src/components/ui/skeleton";

const ColumnSkeleton = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 w-1/4">
      <Skeleton className="h-6 bg-primary w-full" />
      <div className="flex flex-col w-full space-y-5 items-center">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-1/2 bg-primary" />
        ))}
      </div>
    </div>
  );
};

const TableSkeleton = () => {
  return (
    <div className="container mt-10 pt-2">
      <div className="flex items-center justify-between space-x-4 ">
        {Array.from({ length: 8 }).map((_, i) => (
          <ColumnSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

export default TableSkeleton;
