import { FC } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Icons } from "@/components/icons";
import { CalendarDateRangePicker } from "@/components/Date-range-picker";
import ColumnVisibility from "./Column-visibility";

interface TableFiltersProps {
  globalFilter?: string;
  setGlobalFilter: (value: string) => void;
  table: any;
}

const TableFilters: FC<TableFiltersProps> = ({
  globalFilter,
  setGlobalFilter,
  table,
}) => {
  const range = {
    startDate: new Date("2023/06/01"),
    endDate: new Date("2023/06/10"),
  };
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center justify-start space-x-1">
        <ColumnVisibility table={table} />
        {/* Filter global */}
        <Input
          placeholder="Filter..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="flex items-center justify-end space-x-1">
        {/* Filter per date-range */}
        <CalendarDateRangePicker />
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            table.getColumn("date")?.setFilterValue(range);
          }}
        >
          <Icons.filter />
        </Button>
        <Button size="sm" variant="ghost">
          <Icons.download />
        </Button>
      </div>
    </div>
  );
};

export default TableFilters;
