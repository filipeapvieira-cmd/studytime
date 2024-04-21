import { studySessionDto } from "@/src/types";
import { Table } from "@tanstack/table-core";

const convertSessionsToMarkdown = (sessionsToExport: studySessionDto[]) => {
  let markdownString = "";

  const orderedAscByDate = [...sessionsToExport].sort(
    (a, b) =>
      convertStringDateToDate(a.date).getTime() -
      convertStringDateToDate(b.date).getTime()
  );

  markdownString += getIntroduction(orderedAscByDate);
  orderedAscByDate.forEach(
    (session, index) => (markdownString += sessionToMarkdown(session, index))
  );
  return markdownString;
};

const sessionToMarkdown = (studySession: studySessionDto, index: number) => {
  let markdownString = "";

  markdownString += `\n# Session Number: ${index + 1}\n\n`;

  // Create a table for date, effectiveTime, and endTime
  markdownString +=
    "| Date | Start Time | End Time | Pause Duration | Effective Time |\n";
  markdownString += "|-------|------|----------------|----------|----------|\n";
  markdownString += `| ${studySession.date} (${getDayOfTheWeek(
    studySession.date
  )}) | ${studySession.startTime} | ${studySession.endTime} |${
    studySession.pauseDuration
  }|${studySession.effectiveTime}  |\n`;

  markdownString += "\n"; // New line after table

  // Add topics
  markdownString += "## Topics\n\n";
  studySession.topics.forEach((topic, index) => {
    markdownString += `### ${index + 1}. ${topic.title}\n`;
    markdownString += `- **Description:** \n`;
    markdownString += `${addSpacesToDashes(topic.description)}\n`;
    markdownString += `- **Time Spent:** ${convertMillisecondsToString(
      topic.effectiveTimeOfStudy
    )} \n`;
    markdownString += `- **Hashtags:** ${topic.hashtags}\n`;
    markdownString += "\n"; // New line between topics
  });

  // Add feelings
  markdownString += addFeelings(studySession);

  return markdownString;
};

const addFeelings = (studySession: studySessionDto) => {
  if (studySession.feelings && studySession.feelings !== "") {
    return `## Feelings\n${studySession.feelings}\n\n`;
  }
  return "";
};

const addSpacesToDashes = (inputString: string) => {
  return inputString.replace(/(^|[\s\n])-/g, "$1    -");
};

export const convertMillisecondsToString = (milliseconds: number) => {
  const seconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};

const getDayOfTheWeek = (date: string) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dateObj = new Date(date);
  const dayIndex = dateObj.getDay();
  return days[dayIndex];
};

const convertStringDateToDate = (stringDate: string): Date => {
  const [year, month, day] = stringDate.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};

const getEarliestAndLatestDates = (studySessions: studySessionDto[]) => {
  const dates = studySessions.map((studySession) => studySession.date);
  // Step 1: Convert the strings to date objects and store in a new array
  const dateObjects = dates.map((item) => convertStringDateToDate(item));

  // Step 2: Sort the date objects
  dateObjects.sort((a, b) => a.getTime() - b.getTime());
  // Step 3: Get the first and last date objects
  const earliestDate = dateObjects[0];
  const latestDate = dateObjects[dateObjects.length - 1];
  const earliestDateString = earliestDate.toISOString().slice(0, 10);
  const latestDateString = latestDate.toISOString().slice(0, 10);
  return { earliestDateString, latestDateString };
};

const getIntroduction = (studySessions: studySessionDto[]) => {
  const today = new Date().toISOString().slice(0, 10);
  const { earliestDateString, latestDateString } =
    getEarliestAndLatestDates(studySessions);
  const message = `This document, generated on ${getDayOfTheWeek(
    today
  )}, ${today}, contains the logs spanning from **${getDayOfTheWeek(
    earliestDateString
  )}, ${earliestDateString}**, to **${getDayOfTheWeek(
    latestDateString
  )}, ${latestDateString}**.\n`;
  return message;
};

const downloadMarkdownFile = (markdown: string) => {
  const blob = new Blob([markdown], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;

  const now = new Date();
  const fileName = `session-export-${now.toISOString().slice(0, 10)}.md`;
  a.download = fileName;

  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const exportFile = <TData>(table: Table<TData>) => {
  const filteredRows = table.getFilteredRowModel().rows;
  const sessionsToExport: studySessionDto[] = filteredRows.map(
    (row: any) => row.original
  );
  const markdown = convertSessionsToMarkdown(sessionsToExport);
  downloadMarkdownFile(markdown);
  //console.log(markdown);
};
