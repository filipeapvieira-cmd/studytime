"use client";

import { FC, useState, ChangeEvent } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Icons } from "@/components/icons";
import { CalendarDateRangePicker } from "@/components/Date-range-picker";
import ColumnVisibility from "@/components/table/Column-visibility";
import { DateRange } from "react-day-picker";
import BtnClose from "@/components/ui/BtnClose";
import { useTransition } from "react";

interface TableFiltersProps {
  inputGlobalFilter: string;
  globalFilter: string;
  columnFilters: any[];
  setInputGlobalFilter: (value: string) => void;
  setGlobalFilter: (value: string) => void;
  setColumnFilters: (value: any[]) => void;
  table: any;
}

const endOfDay = (date: Date) => {
  let end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return end;
};

const startOfDay = (date: Date) => {
  let start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
};

const TableFilters: FC<TableFiltersProps> = ({
  inputGlobalFilter,
  globalFilter,
  columnFilters,
  setInputGlobalFilter,
  setGlobalFilter,
  setColumnFilters,
  table,
}) => {
  const [isPending, startTransition] = useTransition();
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(Date.now()),
    to: new Date(Date.now()),
  });

  const filterByDateRangeHandler = (range: DateRange | undefined) => {
    if (!range || !range.from) {
      return;
    }

    const endOfDayRange = range.to
      ? { from: startOfDay(range.from), to: endOfDay(range.to) }
      : { from: startOfDay(range.from), to: endOfDay(range.from) };

    table.getColumn("date")?.setFilterValue(endOfDayRange);
  };

  const handleResetGlobalFilter = () => {
    //table.setGlobalFilter("")
    setGlobalFilter("");
    setInputGlobalFilter("");
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputGlobalFilter(event.target.value);
    startTransition(() => setGlobalFilter(event.target.value));
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center justify-start space-x-2">
        <ColumnVisibility table={table} />
        {/* Filter global */}
        <Input
          placeholder="Filter..."
          value={inputGlobalFilter}
          onChange={(event) => handleInputChange(event)}
          className="max-w-sm"
        />
        <BtnClose visible={globalFilter} onClick={handleResetGlobalFilter} />
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
