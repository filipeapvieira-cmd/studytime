"use client";

import { FC } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";

interface DashboardPageProps {}

const fetchData = async () => {
  const response = await fetch("/api/session/get/sessions", {
    method: "GET",
  });
  const data = await response.json();
  console.log(data);
};

const DashboardPage: FC<DashboardPageProps> = ({}) => {
  let studySessions: any[] = [
    {
      id: 1,
      topic: ["Mathematics", "Calculus"],
      subTopic: "Differential Equations",
      sessionDuration: new Date(2023, 5, 26, 2, 0, 0), // 2 hours
      date: new Date(2023, 5, 26, 0, 0, 0),
    },
    {
      id: 2,
      topic: ["Physics", "Thermodynamics"],
      subTopic: "Laws of Thermodynamics",
      sessionDuration: new Date(2023, 5, 26, 1, 0, 0), // 1 hour
      date: new Date(2023, 4, 26, 0, 0, 0),
    },
    {
      id: 3,
      topic: ["Biology", "Genetics"],
      subTopic: "Gene Sequencing",
      sessionDuration: new Date(2023, 5, 26, 3, 0, 0), // 3 hours
      date: new Date(2023, 4, 23, 0, 0, 0),
    },
    {
      id: 4,
      topic: ["Computer Science", "Algorithms"],
      subTopic: "Sorting and Searching",
      sessionDuration: new Date(2023, 5, 26, 1, 30, 0), // 1.5 hours
      date: new Date(2023, 5, 26, 0, 0, 0),
    },
    {
      id: 5,
      topic: ["English", "Literature"],
      subTopic: "Shakespeare's Works",
      sessionDuration: new Date(2023, 5, 25, 2, 30, 0), // 2.5 hours
      date: new Date(2023, 1, 26, 0, 0, 0),
    },
    {
      id: 6,
      topic: ["Chemistry", "Organic Chemistry"],
      subTopic: "Functional Groups",
      sessionDuration: new Date(2023, 5, 26, 1, 30, 0), // 1.5 hours
      date: new Date(2023, 2, 26, 0, 0, 0),
    },
    {
      id: 7,
      topic: ["History", "World War II"],
      subTopic: "Causes and Consequences",
      sessionDuration: new Date(2023, 5, 26, 2, 0, 0), // 2 hours
      date: new Date(2023, 2, 26, 0, 0, 0),
    },
    {
      id: 8,
      topic: ["Economics", "Macroeconomics"],
      subTopic: "Aggregate Demand and Supply",
      sessionDuration: new Date(2023, 5, 26, 1, 30, 0), // 1.5 hours
      date: new Date(2023, 1, 26, 0, 0, 0),
    },
    {
      id: 9,
      topic: ["Geography", "Physical Geography"],
      subTopic: "Climate Zones",
      sessionDuration: new Date(2023, 5, 26, 1, 0, 0), // 1 hour
      date: new Date(2023, 5, 16, 0, 0, 0),
    },
    {
      id: 10,
      topic: ["Art", "Renaissance"],
      subTopic: "Leonardo da Vinci",
      sessionDuration: new Date(2023, 5, 26, 2, 30, 0), // 2.5 hours
      date: new Date(2023, 5, 12, 0, 0, 0),
    },
    {
      id: 11,
      topic: ["Mathematics", "Linear Algebra"],
      subTopic: "Matrix Operations",
      sessionDuration: new Date(2023, 5, 26, 2, 0, 0), // 2 hours
      date: new Date(2023, 5, 10, 0, 0, 0),
    },
    {
      id: 12,
      topic: ["Physics", "Astrophysics"],
      subTopic: "Black Holes",
      sessionDuration: new Date(2023, 5, 26, 1, 30, 0), // 1.5 hours
      date: new Date(2023, 3, 26, 0, 0, 0),
    },
    {
      id: 13,
      topic: ["Biology", "Ecology"],
      subTopic: "Ecosystem Dynamics",
      sessionDuration: new Date(2023, 5, 26, 3, 0, 0), // 3 hours
      date: new Date(2023, 5, 13, 0, 0, 0),
    },
    {
      id: 14,
      topic: ["Computer Science", "Data Structures"],
      subTopic: "Graphs",
      sessionDuration: new Date(2023, 5, 26, 1, 0, 0), // 1 hour
      date: new Date(2023, 5, 4, 0, 0, 0),
    },
    {
      id: 15,
      topic: ["English", "Grammar"],
      subTopic: "Punctuation",
      sessionDuration: new Date(2023, 5, 26, 2, 30, 0), // 2.5 hours
      date: new Date(2023, 5, 3, 0, 0, 0),
    },
  ];

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={studySessions} />
    </div>
  );
};

export default DashboardPage;
