import { Skeleton } from "@/src/components/ui/skeleton";

const BarSkeleton = ({ height }: { height: number }) => {
  return (
    <div className="flex flex-col items-center justify-end h-40 w-10">
      {/* Bar with variable height */}
      <Skeleton
        className={`w-full bg-primary animate-pulse`}
        style={{ height: `${height}%` }}
      />
    </div>
  );
};

const BarChartSkeleton = () => {
  // Define different heights for each bar (in percentage)
  const barHeights = [60, 80, 40, 90, 70, 50, 85, 65];

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Chart Title */}
      <Skeleton className="h-6 w-1/3 mb-6 bg-primary" />

      {/* Chart Area */}
      <div className="flex flex-col h-64 border-l border-b border-gray-300 relative">
        {/* X-Axis Line */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-300"></div>

        {/* Y-Axis Line */}
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-300"></div>

        {/* Bars */}
        <div className="flex items-end justify-between space-x-4 px-8 py-4 h-full">
          {barHeights.map((height, i) => (
            <BarSkeleton key={i} height={height} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BarChartSkeleton;
