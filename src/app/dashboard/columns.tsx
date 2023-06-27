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

/*
Columns are where you define the core of what your table will look like. 
They define the data that will be displayed, how it will be formatted, sorted and filtered
*/

/* export type StudySession = {
  id: number;
  topic: string[];
  subTopic: string[];
  sessionDuration: Date;
  date: Date;
}; */

export type StudySession = {
  id: number;
  date: string;
  effectiveTime: string;
  content: [{ topic: string; subTopic: string; text: string }];
  feelings: string;
};

/* export const dateFilterFn: FilterFn<SessionLog> = (row, id, filterValue) => {
  // Parse the date from the row
  const rowDate = new Date(row.getValue("date"));

  // Check if the date is within the range
  return rowDate >= filterValue.startDate && rowDate <= filterValue.endDate;
}; */
//${     subTopic[index] ? `- ${subTopic[index]}` : ""   }`}
export const columns: ColumnDef<StudySession>[] = [
  {
    accessorKey: "content",
    header: "Content",
    cell: ({ row }) => {
      const rawContent: [{ topic: string; subTopic: string; text: string }] =
        row.getValue("content");
      console.log(rawContent);
      const topicAndSubTopic = rawContent.map((content, index) => (
        <Badge key={index}>{`${content.topic}`}</Badge>
      ));
      return (
        <div className="text-left font-medium space-x-2">
          {topicAndSubTopic}
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    /* filterFn: dateFilterFn, */
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
    header: "Session Duration",
    /*
    cell: ({ row }) => {
      /*
      row.getValue() function from react-table returns the value at 
      the accessor key for the row being rendered.

      This method retrieves the processed value for a given column from the row.
      
      const duration: Date = row.getValue("sessionDuration");
      const hours = duration.getHours().toString().padStart(2, "0");
      const minutes = duration.getMinutes().toString().padStart(2, "0");
      const seconds = duration.getSeconds().toString().padStart(2, "0");
      const formattedDuration = `${hours}:${minutes}:${seconds}`;
      return <div className="text-center font-medium">{formattedDuration}</div>;
    },
    */
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
