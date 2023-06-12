import { FC } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface EditorSkeletonProps {}

const EditorSkeleton: FC<EditorSkeletonProps> = ({}) => {
  return (
    <div className="container h-[500px] mt-10 pt-2">
      <Skeleton className="h-6 w-full" />
      <div className="flex w-full mt-12">
        <div className="w-full space-y-5">
          <div className="space-y-3 ">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-6 w-1/2" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-6 w-1/2" />
          </div>
        </div>
        <div className="w-full space-y-5">
          <div className="space-y-3 ">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-6 w-1/2" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-6 w-1/2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorSkeleton;
