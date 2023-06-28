"use client";

import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import SessionTopic from "@/components/SessionTopic";

/*
Columns are where you define the core of what your table will look like. 
They define the data that will be displayed, how it will be formatted, sorted and filtered
*/

export type StudySession = {
  id: number;
  date: string;
  effectiveTime: string;
  content: [{ topic: string; subTopic: string; text: string }];
  feelings: string;
};

export const dateFilterFn: FilterFn<StudySession> = (row, id, filterValue) => {
  // Parse the date from the row
  const rowDate = new Date(row.getValue("date"));

  // Check if the date is within the range
  return rowDate >= filterValue.startDate && rowDate <= filterValue.endDate;
};

//${     subTopic[index] ? `- ${subTopic[index]}` : ""   }`}
export const columns: ColumnDef<StudySession>[] = [
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
    accessorKey: "content",
    header: "Content",
    cell: ({ row }) => {
      const rawContent: [{ topic: string; subtopic: string; text: string }] =
        row.getValue("content");
      const topicAndSubTopic = rawContent.map((content, index) => (
        <SessionTopic
          key={index}
          topic={content.topic}
          subTopic={content.subtopic}
        />
      ));
      return <>{topicAndSubTopic}</>;
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
    filterFn: dateFilterFn,
    /*     cell: ({ row }) => {
      const date: Date = row.getValue("date");
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      };
      const formattedDate = date.toLocaleDateString(undefined, options);
      return <div className="text-left font-medium">{formattedDate}</div>;
    }, */
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
