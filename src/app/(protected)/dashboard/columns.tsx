"use client";

import { ColumnDef, FilterFn, FilterMeta, Row } from "@tanstack/react-table";
import { Badge } from "@/src/components/ui/badge";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Checkbox } from "@/src/components/ui/checkbox";
import SessionTopic from "@/src/components/SessionTopic";
import { RankAndValue } from "@/src/types/tanstack-table";
import Highlight from "@/src/components/Highlight";
import { studySessionDto } from "@/src/types/index";

/*
Columns are where you define the core of what your table will look like. 
They define the data that will be displayed, how it will be formatted, sorted and filtered
*/

export const contentFilterFn: FilterFn<studySessionDto> = (
  row,
  id,
  filterValue
) => {
  const rawContent: [{ topic: string; subtopic: string; text: string }] =
    row.getValue("content");
  return rawContent.some(
    (content) =>
      content.topic.toLowerCase().includes(filterValue.toLowerCase()) ||
      content.subtopic.toLowerCase().includes(filterValue.toLowerCase())
  );
};

export const dateFilterFn: FilterFn<studySessionDto> = (
  row,
  id,
  filterValue
) => {
  // Parse the date from the row
  const rowDate = new Date(row.getValue("date"));
  return rowDate >= filterValue.from && rowDate <= filterValue.to;
};

const rankItem = (itemValue: any, filterValue: any) => {
  let itemRank = { passed: false };
  if (itemValue && filterValue) {
    // Convert both itemValue and filterValue to lowercase for case insensitive comparison
    itemValue = itemValue.toLowerCase();
    filterValue = filterValue.toLowerCase();
    // Check if itemValue contains filterValue as a substring
    itemRank.passed = itemValue.includes(filterValue);
  }
  return itemRank;
};

export const globalFilterFn: FilterFn<any> = (
  row,
  columnId,
  value,
  addMeta
) => {
  /*   // Ignore filtering if the column is not visible
  const columnIsVisible = columnVisibility[columnId];
  if (columnIsVisible === false) {
    return false;
  } */

  let itemRank;

  if (columnId === "topics") {
    // The 'topics' column is an array of objects.
    // Search both 'title', 'hashtags' and 'description' fields.
    const rawTopics: [
      { title: string; hashtags: string; description: string }
    ] = row.getValue(columnId);
    itemRank = rankItem(
      `${rawTopics.map((topic) => topic.title).join(" ")} ${rawTopics
        .map((topic) => topic.hashtags)
        .join(" ")} ${rawTopics.map((topic) => topic.description).join(" ")}`,
      value
    );
  } else {
    itemRank = rankItem(row.getValue(columnId), value);
  }

  addMeta({ itemRank, value } as RankAndValue);
  return itemRank.passed;
};

export const columns: ColumnDef<studySessionDto>[] = [
  {
    id: "select",
    header: ({ table }) => {
      return (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      );
    },
    cell: ({ row }) => {
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "topics",
    header: "Content",
    cell: ({ row }) => {
      const rawContent: [
        { title: string; hashtags: string; description: string }
      ] = row.getValue("topics");
      const topics = rawContent.map((topic, index) => (
        <SessionTopic
          key={index}
          title={topic.title}
          hashtags={topic.hashtags}
          searchInput={
            (row.columnFiltersMeta.content as RankAndValue)?.value || ""
          }
        />
      ));
      return <div className="space-y-2">{topics}</div>;
    },
  },
  {
    accessorKey: "feelings",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Feelings
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const text: string = row.getValue("feelings");
      const searchInput =
        (row.columnFiltersMeta.feeling as RankAndValue)?.value || "";
      return (
        <div className="w-96 flex-grow-0">
          <Highlight searchInput={searchInput} text={text} />
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const text: string = row.getValue("date");
      const searchInput =
        (row.columnFiltersMeta.date as RankAndValue)?.value || "";
      return (
        <div className="max-w-md">
          <Highlight searchInput={searchInput} text={text} />
        </div>
      );
    },
    filterFn: dateFilterFn,
  },
  {
    accessorKey: "effectiveTime",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Session Duration
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const text: string = row.getValue("effectiveTime");
      const searchInput =
        (row.columnFiltersMeta.effectiveTime as RankAndValue)?.value || "";
      return (
        <div className="max-w-md text-center">
          <Highlight searchInput={searchInput} text={text} />
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      /*
      Access the row data using row.original in the cell function. 
      Use this to handle actions for your row eg. use the id to make a DELETE call to your API.

      The row.original expression directly accesses the data of the row as it was 
      provided to the table. 
      It doesn't apply any data processing transformations that you might have defined 
      in your column definitions.
      */
      const session = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(String(session.id))}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
