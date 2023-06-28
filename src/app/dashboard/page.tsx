"use client";

import { FC, useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import SessionTopic from "@/components/SessionTopic";

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
    const fetchAndSetData = async () => {
      const studySessions = await fetchData();
      setData(studySessions);
    };
    fetchAndSetData();
    console.log("Fetch data from useEffect");
  }, []);

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default DashboardPage;
