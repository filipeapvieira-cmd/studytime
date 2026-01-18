import type { OutputData } from "@editorjs/editorjs";
import type { Table } from "@tanstack/table-core";
import EditorJsHtml from "editorjs-html";
import type { StudySessionDto } from "@/src/types";

// Initialize the Editor.js to HTML parser
const edjsParser = EditorJsHtml({
  list: (block) => {
    const { style, items } = block.data;

    // Handle checklist style
    if (style === "checklist") {
      const htmlItems = items
        .map((item: any) => {
          const checkedAttr = item.meta.checked ? " checked" : "";
          return `<div><input type="checkbox"${checkedAttr} disabled> ${item.content}</div>`;
        })
        .join("");
      return htmlItems;
    }

    // Handle standard ordered/unordered lists
    const tag = style === "ordered" ? "ol" : "ul";
    const htmlItems = items
      .map((item: any) => `<li>${item.content}</li>`)
      .join("");
    return `<${tag}>${htmlItems}</${tag}>`;
  },
});

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

const getEarliestAndLatestDates = (studySessions: StudySessionDto[]) => {
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

const getIntroduction = (studySessions: StudySessionDto[]) => {
  const today = new Date().toISOString().slice(0, 10);
  const { earliestDateString, latestDateString } =
    getEarliestAndLatestDates(studySessions);
  const message = `This document, generated on ${getDayOfTheWeek(
    today,
  )}, ${today}, contains the logs spanning from <b>${getDayOfTheWeek(
    earliestDateString,
  )}, ${earliestDateString}</b>, to <b>${getDayOfTheWeek(
    latestDateString,
  )}, ${latestDateString}</b>.`;
  return message;
};

function getSortedSessions(table: any): StudySessionDto[] {
  const filteredRows = table.getFilteredRowModel().rows;
  const sessionsToExport: StudySessionDto[] = filteredRows.map(
    (row: any) => row.original,
  );

  sessionsToExport.sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  return sessionsToExport;
}

export const exportFile = <TData>(table: Table<TData>) => {
  const filteredRows = getSortedSessions(table);
  const htmlString = exportStudySessionsToHtml(filteredRows);
  downloadHtmlFile(htmlString, "study-sessions.html");
};

/**
 * Creates a downloadable HTML file from the provided HTML content.
 */
export function downloadHtmlFile(
  content: string,
  filename = "content.html",
): void {
  const blob = new Blob([content], { type: "text/html" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Converts an array of Editor.js outputs to a single HTML string
 */
export function exportStudySessionsToHtml(sessions: StudySessionDto[]): string {
  let htmlContent = `<!DOCTYPE html>
<html>
<head>
    <title>Study Sessions</title>
    <style>
      /* Ensure images do not overflow their container */
      img {
        max-width: 100%;
        height: auto;
      }
    </style>
</head>
<body style="font-family: system-ui, -apple-system, sans-serif; max-width: 800px; margin: 2rem auto; padding: 0 1rem; background-color: #f8f9fa;">
<div style="
    text-align: center; 
    margin-bottom: 3rem; 
    font-family: 'Georgia', serif; 
    background-color: #f8f9fa; 
    padding: 1rem; 
    border-left: 4px solid #343a40; 
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
">
    <h1 style="
        color: #343a40; 
        font-size: 2.8rem; 
        margin-bottom: 0.5rem; 
        font-weight: normal; 
        letter-spacing: -1px;
    ">
        Study Sessions
    </h1>
    
    <div style="
        width: 50px; 
        height: 1px; 
        background-color: #343a40; 
        margin: 1.5rem auto;
    "></div>  
    
      <p style="color: #495057; font-size: 1rem; max-width: 600px; margin: 0 auto; line-height: 1.6;">
${getIntroduction(sessions)}
</p>
</div>
`;

  // Process each study session.
  sessions.forEach((session) => {
    htmlContent += `    
    <div style="text-align: center; margin-bottom: 2rem;">
        <h2 style="color: #4a5568; font-size: 1.5rem; font-weight: normal; margin-top: 0;">Session on ${session.date}</h2>
    </div>

    <div style="display: flex; justify-content: center; gap: 1rem; margin-top: 2rem;">
        <div style="background: white; padding: 1rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center; width: 150px;">
            <h3 style="color: #4a5568; font-size: 0.875rem; margin: 0 0 0.25rem 0;">Start Time</h3>
            <p style="color: #1a1a1a; font-size: 1rem; margin: 0; font-weight: 500;">${session.startTime}</p>
        </div>

        <div style="background: white; padding: 1rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center; width: 150px;">
            <h3 style="color: #4a5568; font-size: 0.875rem; margin: 0 0 0.25rem 0;">End Time</h3>
            <p style="color: #1a1a1a; font-size: 1rem; margin: 0; font-weight: 500;">${session.endTime}</p>
        </div>

        <div style="background: white; padding: 1rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center; width: 150px;">
            <h3 style="color: #4a5568; font-size: 0.875rem; margin: 0 0 0.25rem 0;">Pause Duration</h3>
            <p style="color: #1a1a1a; font-size: 1rem; margin: 0; font-weight: 500;">${session.pauseDuration}</p>
        </div>

        <div style="background: white; padding: 1rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center; width: 150px;">
            <h3 style="color: #4a5568; font-size: 0.875rem; margin: 0 0 0.25rem 0;">Effective Time</h3>
            <p style="color: #1a1a1a; font-size: 1rem; margin: 0; font-weight: 500;">${session.effectiveTime}</p>
        </div>
    </div>
`;

    // Process each topic within the session.
    if (session.topics && session.topics.length > 0) {
      session.topics.forEach((topic) => {
        let topicHtml = "";

        try {
          // Convert the Editor.js JSON to HTML.
          const parsedBlocks = edjsParser.parse(
            topic.contentJson as unknown as OutputData,
          );
          topicHtml = Array.isArray(parsedBlocks)
            ? parsedBlocks.join("")
            : parsedBlocks;
        } catch (error) {
          console.error(
            `Error parsing content for topic "${topic.title}":`,
            error,
          );
          topicHtml = `<p>Error rendering content.</p>`;
        }

        htmlContent += `
    <div style="margin: 2rem auto; padding: 1rem; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); max-width: 800px;">
        <h3 style="color: #1a1a1a; font-size: 1.5rem; margin-bottom: 1rem;">${topic.title}</h3>
        ${topicHtml}
    </div>
`;
      });
    }

    // Add a horizontal rule to visually separate sessions.
    htmlContent += `
    <hr style="margin-top: 2rem; border: none; border-top: 2px solid #ccc;">
`;
  });

  htmlContent += `
</body>
</html>
`;

  return htmlContent;
}
