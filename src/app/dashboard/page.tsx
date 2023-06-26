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
}

const DashboardPage: FC<DashboardPageProps> = ({}) => {

  let studySessions: any[] = [
    {
        topic: ["Mathematics", "Calculus"],
        subTopic: "Differential Equations",
        sessionDuration: new Date(2023, 5, 26, 2, 0, 0), // 2 hours
    },
    {
        topic: ["Physics", "Thermodynamics"],
        subTopic: "Laws of Thermodynamics",
        sessionDuration: new Date(2023, 5, 26, 1, 0, 0), // 1 hour
    },
    {
        topic: ["Biology", "Genetics"],
        subTopic: "Gene Sequencing",
        sessionDuration: new Date(2023, 5, 26, 3, 0, 0), // 3 hours
    },
    {
        topic: ["Computer Science", "Algorithms"],
        subTopic: "Sorting and Searching",
        sessionDuration: new Date(2023, 5, 26, 1, 30, 0), // 1.5 hours
    },
    {
        topic: ["English", "Literature"],
        subTopic: "Shakespeare's Works",
        sessionDuration: new Date(2023, 5, 26, 2, 30, 0), // 2.5 hours
    },
];

  return(
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={studySessions} />
    </div>
  );
};

export default DashboardPage;
