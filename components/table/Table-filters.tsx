"use client";

import { FC, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Icons } from "@/components/icons";
import { CalendarDateRangePicker } from "@/components/Date-range-picker";
import ColumnVisibility from "@/components/table/Column-visibility";
import { DateRange } from "react-day-picker";
import BtnClose from "@/components/ui/BtnClose";

interface TableFiltersProps {
  globalFilter: string;
  columnFilters: any[];
  setGlobalFilter: (value: string) => void;
  setColumnFilters: (value: any[]) => void;
  table: any;
}

const endOfDay = (date: Date) => {
  let end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return end;
};

const TableFilters: FC<TableFiltersProps> = ({
  globalFilter,
  columnFilters,
  setGlobalFilter,
  setColumnFilters,
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
      <div className="flex items-center justify-start space-x-2">
        <ColumnVisibility table={table} />
        {/* Filter global */}
        <Input
          placeholder="Filter..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        <BtnClose
          visible={globalFilter}
          onClick={() => table.setGlobalFilter("")}
        />
      </div>
      <div className="flex items-center justify-end space-x-2">
        <BtnClose
          visible={columnFilters.length > 0}
          onClick={() => table.setColumnFilters([])}
        />
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
