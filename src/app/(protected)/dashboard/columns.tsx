"use client";

import type { ColumnDef, FilterFn } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import Highlight from "@/src/components/Highlight";
import SessionTopic from "@/src/components/SessionTopic";
import { Button } from "@/src/components/ui/button";
import { getFeelingsDisplayName } from "@/src/lib/utils";
import type { EditorData, StudySessionDto } from "@/src/types/index";
import type { RankAndValue } from "@/src/types/tanstack-table";

/*
Columns are where you define the core of what your table will look like. 
They define the data that will be displayed, how it will be formatted, sorted and filtered
*/

export const contentFilterFn: FilterFn<StudySessionDto> = (
  row,
  id,
  filterValue,
) => {
  const rawContent: [{ topic: string; subtopic: string; text: string }] =
    row.getValue("content");
  return rawContent.some(
    (content) =>
      content.topic.toLowerCase().includes(filterValue.toLowerCase()) ||
      content.subtopic.toLowerCase().includes(filterValue.toLowerCase()),
  );
};

export const dateFilterFn: FilterFn<StudySessionDto> = (
  row,
  id,
  filterValue,
) => {
  // Parse the date from the row
  const rowDate = new Date(row.getValue("date"));
  return rowDate >= filterValue.from && rowDate <= filterValue.to;
};

const rankItem = (itemValue: any, filterValue: any) => {
  const itemRank = { passed: false };
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
  addMeta,
) => {
  // Helper function to extract text from contentJson
  const extractTextFromContentJson = (contentJson: EditorData): string => {
    if (
      !contentJson ||
      !contentJson.blocks ||
      !Array.isArray(contentJson.blocks)
    )
      return "";
    return contentJson.blocks
      .map((block: any) => block.data?.text || "")
      .join(" ");
  };

  let itemRank;

  if (columnId === "topics") {
    // The 'topics' column is an array of objects.
    // For each topic, search the title, hashtags, description, and text extracted from contentJson.
    const rawTopics: {
      title: string;
      hashtags: string;
      description: string;
      contentJson: any;
    }[] = row.getValue(columnId);

    const combinedText = rawTopics
      .map((topic) => {
        const title = topic.title || "";
        const hashtags = topic.hashtags || "";
        const description = topic.description || "";
        const content = extractTextFromContentJson(topic.contentJson);
        return `${title} ${hashtags} ${description} ${content}`;
      })
      .join(" ");

    itemRank = rankItem(combinedText, value);
  } else {
    itemRank = rankItem(row.getValue(columnId), value);
  }

  addMeta({ itemRank, value } as RankAndValue);
  return itemRank.passed;
};

export const columns: ColumnDef<StudySessionDto>[] = [
  {
    accessorKey: "topics",
    header: "Content",
    cell: ({ row }) => {
      const rawContent: [
        { title: string; hashtags: string; description: string },
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
        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Feelings
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const text: string = row.getValue("feelings");
      const formattedText = text && getFeelingsDisplayName(text);
      const searchInput =
        (row.columnFiltersMeta.feeling as RankAndValue)?.value || "";
      return (
        <div className="text-center">
          <Highlight searchInput={searchInput} text={formattedText} />
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const text: string = row.getValue("date");
      const searchInput =
        (row.columnFiltersMeta.date as RankAndValue)?.value || "";
      return (
        <div className="text-center">
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
        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Session Duration
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const text: string = row.getValue("effectiveTime");
      const searchInput =
        (row.columnFiltersMeta.effectiveTime as RankAndValue)?.value || "";
      return (
        <div className="text-center">
          <Highlight searchInput={searchInput} text={text} />
        </div>
      );
    },
  },
];
