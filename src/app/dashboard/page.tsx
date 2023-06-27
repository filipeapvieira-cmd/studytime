"use client";

import { FC, useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";

interface DashboardPageProps {}

const fetchData = async () => {
  const response = await fetch("/api/session/get/sessions", {
    method: "GET",
  });
  const { data } = await response.json();

  return data;
};

const DashboardPage: FC<DashboardPageProps> = ({}) => {
  const [data, setData] = useState([]);

  console.log(data);

  useEffect(() => {
    const fecthAndSetData = async () => {
      const studySessions = await fetchData();
      setData(studySessions);
    };
    fecthAndSetData();
    console.log("Fetch data from useEffect");
  }, []);

  /* let studySessions = [
    {
      id: 1,
      topic: ["Mathematics", "Calculus"],
      subTopic: ["Differential Equations"], // Updated to an array of strings
      sessionDuration: new Date(2023, 5, 26, 2, 0, 0), // 2 hours
      date: new Date(2023, 5, 26, 0, 0, 0),
    },
    {
      id: 2,
      topic: ["Physics", "Thermodynamics"],
      subTopic: ["Laws of Thermodynamics"], // Updated to an array of strings
      sessionDuration: new Date(2023, 5, 26, 1, 0, 0), // 1 hour
      date: new Date(2023, 4, 26, 0, 0, 0),
    },
    {
      id: 3,
      topic: ["Biology", "Genetics"],
      subTopic: ["Gene Sequencing"], // Updated to an array of strings
      sessionDuration: new Date(2023, 5, 26, 3, 0, 0), // 3 hours
      date: new Date(2023, 4, 23, 0, 0, 0),
    },
    {
      id: 4,
      topic: ["Computer Science", "Algorithms"],
      subTopic: ["Sorting and Searching"], // Updated to an array of strings
      sessionDuration: new Date(2023, 5, 26, 1, 30, 0), // 1.5 hours
      date: new Date(2023, 5, 26, 0, 0, 0),
    },
    {
      id: 5,
      topic: ["English", "Literature"],
      subTopic: ["Shakespeare's Works"], // Updated to an array of strings
      sessionDuration: new Date(2023, 5, 25, 2, 30, 0), // 2.5 hours
      date: new Date(2023, 1, 26, 0, 0, 0),
    },
    {
      id: 6,
      topic: ["Chemistry", "Organic Chemistry"],
      subTopic: ["Functional Groups"], // Updated to an array of strings
      sessionDuration: new Date(2023, 5, 26, 1, 30, 0), // 1.5 hours
      date: new Date(2023, 2, 26, 0, 0, 0),
    },
    {
      id: 7,
      topic: ["History", "World War II"],
      subTopic: ["Causes and Consequences"], // Updated to an array of strings
      sessionDuration: new Date(2023, 5, 26, 2, 0, 0), // 2 hours
      date: new Date(2023, 2, 26, 0, 0, 0),
    },
    {
      id: 8,
      topic: ["Economics", "Macroeconomics"],
      subTopic: ["Aggregate Demand and Supply"], // Updated to an array of strings
      sessionDuration: new Date(2023, 5, 26, 1, 30, 0), // 1.5 hours
      date: new Date(2023, 1, 26, 0, 0, 0),
    },
    {
      id: 9,
      topic: ["Geography", "Physical Geography"],
      subTopic: ["Climate Zones"], // Updated to an array of strings
      sessionDuration: new Date(2023, 5, 26, 1, 0, 0), // 1 hour
      date: new Date(2023, 5, 16, 0, 0, 0),
    },
    {
      id: 10,
      topic: ["Art", "Renaissance"],
      subTopic: ["Leonardo da Vinci"], // Updated to an array of strings
      sessionDuration: new Date(2023, 5, 26, 2, 30, 0), // 2.5 hours
      date: new Date(2023, 5, 12, 0, 0, 0),
    },
    {
      id: 11,
      topic: ["Mathematics", "Linear Algebra"],
      subTopic: ["Matrix Operations"], // Updated to an array of strings
      sessionDuration: new Date(2023, 5, 26, 2, 0, 0), // 2 hours
      date: new Date(2023, 5, 10, 0, 0, 0),
    },
    {
      id: 12,
      topic: ["Physics", "Astrophysics"],
      subTopic: ["Black Holes"], // Updated to an array of strings
      sessionDuration: new Date(2023, 5, 26, 1, 30, 0), // 1.5 hours
      date: new Date(2023, 3, 26, 0, 0, 0),
    },
    {
      id: 13,
      topic: ["Biology", "Ecology"],
      subTopic: ["Ecosystem Dynamics"], // Updated to an array of strings
      sessionDuration: new Date(2023, 5, 26, 3, 0, 0), // 3 hours
      date: new Date(2023, 5, 13, 0, 0, 0),
    },
    {
      id: 14,
      topic: ["Computer Science", "Data Structures"],
      subTopic: ["Graphs"], // Updated to an array of strings
      sessionDuration: new Date(2023, 5, 26, 1, 0, 0), // 1 hour
      date: new Date(2023, 5, 4, 0, 0, 0),
    },
    {
      id: 15,
      topic: ["English", "Grammar"],
      subTopic: ["Punctuation"], // Updated to an array of strings
      sessionDuration: new Date(2023, 5, 26, 2, 30, 0), // 2.5 hours
      date: new Date(2023, 5, 3, 0, 0, 0),
    },
  ]; */

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default DashboardPage;
