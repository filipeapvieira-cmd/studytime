"use client"
 
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"


/*
Columns are where you define the core of what your table will look like. 
They define the data that will be displayed, how it will be formatted, sorted and filtered
*/

export type StudySession = {
    topic: string[],
    subTopic: string,
    sessionDuration: Date,
}

export const columns: ColumnDef<StudySession>[] = [
    {
        accessorKey: "topic",
        header: "Topic",
        cell: ({row}) => {
          const topic: string[] = row.getValue("topic");
          const badgeTopic = topic.map((topic, index) => <Badge key={index}>{topic}</Badge>)
          return (<div className="text-left font-medium space-x-2">{badgeTopic}</div>);
        },
      },
      {
        accessorKey: "subTopic",
        header: "Sub-Topic",
      },
      {
        accessorKey: "sessionDuration",
        header: "Session Duration",
        cell: ({row}) => {
          //row.getValue() function from react-table returns the value at the accessor key for the row being rendered.
          const duration: Date = row.getValue("sessionDuration");          
          const hours = duration.getHours().toString().padStart(2, '0');
          const minutes = duration.getMinutes().toString().padStart(2, '0');
          const seconds = duration.getSeconds().toString().padStart(2, '0');
          const formattedDuration = `${hours}:${minutes}:${seconds}`;
          return (<div className="text-center font-medium">{formattedDuration}</div>);
        },        
      },
];