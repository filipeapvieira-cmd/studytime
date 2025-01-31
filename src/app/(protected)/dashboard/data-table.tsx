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

import { useState, useCallback } from "react";
import { DataTablePagination } from "@/src/components/table/data-table-pagination";
import { globalFilterFn } from "@/src/app/(protected)/dashboard/columns";
import TableFilters from "@/src/components/table/Table-filters";
import EditSession from "@/src/components/EditSession";
import { StudySessionDto } from "@/src/types";
import { createNewTopic } from "@/src/ctx/session-topics-provider";
import { convertListToTopic } from "@/src/lib/hooks/utils";
import { useUpdateSessionContext } from "@/src/ctx/update-session-provider";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const {
    sessionToEdit,
    setSessionToEdit,
    setSessionTopicsUpdate,
    setSessionFeelingsUpdate,
  } = useUpdateSessionContext();

  const [sorting, setSorting] = useState<SortingState>([
    { id: "date", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [inputGlobalFilter, setInputGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const [isEditSessionOpen, setIsEditSessionOpen] = useState(false);

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
      setSessionTopicsUpdate(convertListToTopic(sessionData.topics));
      setSessionFeelingsUpdate(sessionData.feelings || "");
      setIsEditSessionOpen(true);
    }
  };

  const handleModalClose = (isOpen: boolean) => {
    setSessionToEdit(null);
    setSessionTopicsUpdate([createNewTopic()]);
    setSessionFeelingsUpdate("");
    setIsEditSessionOpen(isOpen);
  };

  return (
    <div>
      {isEditSessionOpen && sessionToEdit && (
        <EditSession
          isModalOpen={isEditSessionOpen}
          handleModalClose={handleModalClose}
          selectedStudySession={sessionToEdit}
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
