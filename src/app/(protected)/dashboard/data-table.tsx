"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  getFilteredRowModel,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  VisibilityState,
  Row,
  Cell,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useState, useCallback, useEffect, useContext } from "react";
import { CalendarDateRangePicker } from "@/src/components/Date-range-picker";
import { DataTablePagination } from "@/src/components/table/data-table-pagination";
import { globalFilterFn } from "@/src/app/(protected)/dashboard/columns";
import { Icons } from "@/src/components/icons";
import TableFilters from "@/src/components/table/Table-filters";
import EditSession from "@/src/components/EditSession";
import { set } from "date-fns";
import { StudySessionDto } from "@/src/types";
import {
  createNewTopic,
  TopicsContext,
} from "@/src/ctx/session-topics-provider";
import { FeelingsContext } from "@/src/ctx/session-feelings-provider";
import { convertListToTopic } from "@/src/lib/hooks/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const { setSessionFeelingsUpdate } = useContext(FeelingsContext);
  const { setSessionTopicsUpdate } = useContext(TopicsContext);
  const defaultStudySession = {
    id: 0,
    date: "",
    effectiveTime: "",
    content: [
      {
        topic: "",
        subtopic: "",
        text: "",
      },
    ],
    feeling: "",
    endTime: "",
    startTime: "",
    pauseDuration: "",
  };

  const [sorting, setSorting] = useState<SortingState>([
    { id: "date", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [inputGlobalFilter, setInputGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const [isEditSessionOpen, setIsEditSessionOpen] = useState(false);
  const [sessionToEdit, setSessionToEdit] = useState({});

  // Only filter if column is visible
  const filterFn = useCallback(
    (row: Row<TData>, columnId: string, value: string, addMeta: any) => {
      // Create a closure that captures columnVisibility
      const globalFilterFnWithVisibility = (
        row: Row<TData>,
        columnId: string,
        value: string,
        addMeta: any
      ) => {
        // Check if the column is visible before applying the filter
        if (columnVisibility[columnId] !== false) {
          return globalFilterFn(row, columnId, value, addMeta);
        } else {
          return false; // for hidden columns
        }
      };

      return globalFilterFnWithVisibility(row, columnId, value, addMeta);
    },
    [columnVisibility] // Recreate the function whenever columnVisibility changes
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    globalFilterFn: filterFn,
    getColumnCanGlobalFilter: () => true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
      rowSelection,
    },
  });

  const handleCellClick = (cell: Cell<TData, unknown>) => {
    if (cell.column.id !== "select") {
      console.log(cell.row.original);
      const sessionData = cell.row.original as StudySessionDto;
      setSessionToEdit(sessionData);
      setIsEditSessionOpen(true);
    }
  };

  // Update ctx with data from the selected session to edit
  useEffect(() => {
    if (isEditSessionOpen) {
      setSessionTopicsUpdate(
        convertListToTopic((sessionToEdit as StudySessionDto).topics)
      );
      setSessionFeelingsUpdate(
        (sessionToEdit as StudySessionDto).feelings || ""
      );
    }
  }, [
    isEditSessionOpen,
    setSessionTopicsUpdate,
    setSessionFeelingsUpdate,
    sessionToEdit,
  ]);

  const handleModalClose = (isOpen: boolean) => {
    // Add default data when modal closes
    setSessionTopicsUpdate([createNewTopic()]);
    setSessionFeelingsUpdate("");
    setIsEditSessionOpen(isOpen);
  };

  return (
    <div>
      {isEditSessionOpen && (
        <EditSession
          isModalOpen={isEditSessionOpen}
          handleModalClose={handleModalClose}
          selectedStudySession={sessionToEdit as StudySessionDto}
        />
      )}
      <TableFilters
        columnFilters={columnFilters}
        globalFilter={globalFilter}
        table={table}
        setGlobalFilter={setGlobalFilter}
        setColumnFilters={setColumnFilters}
        inputGlobalFilter={inputGlobalFilter}
        setInputGlobalFilter={setInputGlobalFilter}
      />

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="hover:cursor-pointer"
                  onClick={() => {
                    console.log(row.original);
                  }}
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      onClick={() => handleCellClick(cell)}
                    >
                      <>{}</>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4">
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
