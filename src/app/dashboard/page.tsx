"use client";
import { FC } from "react";

interface DashboardPageProps {}

const fetchData = async () => {
  const response = await fetch("/api/session/get/sessions", {
    method: "GET",
  });
  const data = await response.json();
  console.log(data);
}

const DashboardPage: FC<DashboardPageProps> = ({}) => {
  fetchData();
  return <div>DashboardPage</div>;
};

export default DashboardPage;
