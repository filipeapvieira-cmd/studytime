import { FC } from "react";
import { Skeleton } from "@/src/components/ui/skeleton";

interface EditorSkeletonProps {}

const EditorSkeleton: FC<EditorSkeletonProps> = ({}) => {
  return (
    <div className="max-w-6xl md:min-w-[1000px] w-4/5 mx-auto h-[500px] mt-10 pt-2">
      <Skeleton className="h-6 w-full bg-primary" />
      <div className="flex w-full mt-12">
        <div className="w-full space-y-5">
          <div className="space-y-3 ">
            <Skeleton className="h-6 w-2/3 bg-primary" />
            <Skeleton className="h-6 w-2/3 bg-primary" />
            <Skeleton className="h-6 w-1/2 bg-primary" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-6 w-2/3 bg-primary" />
            <Skeleton className="h-6 w-2/3 bg-primary" />
            <Skeleton className="h-6 w-1/2 bg-primary" />
          </div>
        </div>
        <div className="w-full space-y-5">
          <div className="space-y-3 ">
            <Skeleton className="h-6 w-2/3 bg-primary" />
            <Skeleton className="h-6 w-2/3 bg-primary" />
            <Skeleton className="h-6 w-1/2 bg-primary" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-6 w-2/3 bg-primary" />
            <Skeleton className="h-6 w-2/3 bg-primary" />
            <Skeleton className="h-6 w-1/2 bg-primary" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorSkeleton;
