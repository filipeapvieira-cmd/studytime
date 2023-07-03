"use client";

import { FC, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Icons } from "@/components/icons";
import { CalendarDateRangePicker } from "@/components/Date-range-picker";
import ColumnVisibility from "./Column-visibility";
import { DateRange } from "react-day-picker";

interface TableFiltersProps {
  globalFilter?: string;
  setGlobalFilter: (value: string) => void;
  table: any;
}

const endOfDay = (date: Date) => {
  let end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return end;
};

const TableFilters: FC<TableFiltersProps> = ({
  globalFilter,
  setGlobalFilter,
  table,
}) => {
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(Date.now()),
    to: new Date(Date.now()),
  });

  const filterByDateRangeHandler = (range: DateRange | undefined) => {
    if (!range) {
      return;
    }

    const endOfDayRange =
      range.from && range.to
        ? { ...range, to: endOfDay(range.to) }
        : { ...range, to: range.from && endOfDay(range.from) };

    table.getColumn("date")?.setFilterValue(endOfDayRange);
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
        <CalendarDateRangePicker date={range} setDate={setRange} />
        <Button
          size="sm"
          variant="ghost"
          onClick={() => filterByDateRangeHandler(range)}
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
