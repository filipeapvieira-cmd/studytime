import { EditorData, JSONValue, StudySessionDto } from "@/src/types";
import { Table } from "@tanstack/table-core";
import { convertMillisecondsToTimeString } from "../session-log/update-utils";
import EditorJsHtml from "editorjs-html";
import TurndownService from "turndown";
import { OutputData } from "@editorjs/editorjs";

// Initialize the Editor.js to HTML parser
const edjsParser = EditorJsHtml();
// Initialize the Turndown service to convert HTML to Markdown
const turndownService = new TurndownService();

const convertSessionsToMarkdown = (sessionsToExport: StudySessionDto[]) => {
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

const sessionToMarkdown = (studySession: StudySessionDto, index: number) => {
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
    markdownString += `${addSpacesToDashes(topic.description || "")}\n`;
    markdownString += `- **Time Spent:** ${convertMillisecondsToTimeString(
      topic.effectiveTimeOfStudy
    )} \n`;
    markdownString += `- **Hashtags:** ${topic.hashtags}\n`;
    markdownString += "\n"; // New line between topics
  });

  // Add feelings
  markdownString += addFeelings(studySession);

  return markdownString;
};

const addFeelings = (studySession: StudySessionDto) => {
  if (studySession.feelings && studySession.feelings !== "") {
    return `## Feelings\n${studySession.feelings}\n\n`;
  }
  return "";
};

const addSpacesToDashes = (inputString: string) => {
  return inputString.replace(/(^|[\s\n])-/g, "$1    -");
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
  const sessionsToExport: StudySessionDto[] = filteredRows.map(
    (row: any) => row.original
  );

  /* console.log(sessionsToExport);
  console.log(filterSessionsWithValidJson(sessionsToExport)); */

  const htmlString = exportStudySessionsToHtml(sessionsToExport);

  // Download the Editor.js content as an HTML file.
  downloadMultipleEditorJsContentAsHtml(htmlString);
  /* const markdown = convertSessionsToMarkdown(sessionsToExport);
  downloadMarkdownFile(markdown); */
  //console.log(markdown);
};

/**
 * Validates a StudySessionDto.
 * Returns `false` if any topic does not have a valid `contentJson`.
 * Otherwise, returns `true`.
 */
export function validateStudySession(session: StudySessionDto): boolean {
  return session.topics.every(
    (topic) => topic.contentJson !== undefined && topic.contentJson !== null
  );
}

/**
 * Filters an array of StudySessionDto objects,
 * returning only those sessions where every topic has a valid `contentJson`.
 */
export function filterSessionsWithValidJson(
  sessions: StudySessionDto[]
): StudySessionDto[] {
  return sessions.filter(validateStudySession);
}

/**
 * Converts Editor.js output to an HTML string.
 */
export function convertEditorJsToHtml(editorJsOutput: EditorData): string {
  // Parse the Editor.js output into an array of HTML strings
  const parsedOutput = edjsParser.parse(editorJsOutput) as string | string[];
  // Join the HTML segments with newline characters to form a complete HTML string
  if (Array.isArray(parsedOutput)) {
    return parsedOutput.join("\n");
  }
  return parsedOutput;
}

/**
 * Converts Editor.js output to a Markdown string.
 */
export function convertEditorJsToMarkdown(editorJsOutput: EditorData): string {
  // First, convert the Editor.js output to HTML
  const htmlOutput: string = convertEditorJsToHtml(editorJsOutput);
  // Then, convert the HTML output to Markdown using TurndownService
  return turndownService.turndown(htmlOutput);
}

/**
 * Creates a downloadable HTML file from the provided HTML content.
 */
export function downloadHtmlFile(
  content: string,
  filename = "content.html"
): void {
  // Create a Blob from the HTML content
  const blob = new Blob([content], { type: "text/html" });
  // Create a URL for the Blob
  const url = window.URL.createObjectURL(blob);
  // Create a temporary anchor element to trigger the download
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  // Clean up
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Converts Editor.js output to HTML and downloads it as an HTML file.
 */
export function downloadEditorJsContentAsHtml(
  editorJsOutput: EditorData,
  filename = "content.html"
): void {
  const htmlContent = convertEditorJsToHtml(editorJsOutput);
  downloadHtmlFile(htmlContent, filename);
}

/**
 * Converts an array of Editor.js outputs to a single HTML string with separators
 * between each session, and downloads it as an HTML file.
 */
export function downloadMultipleEditorJsContentAsHtml(
  combinedHtml: string,
  filename = "combined-content.html"
): void {
  // Download the combined HTML content as a file
  downloadHtmlFile(combinedHtml, filename);
}

/**
 * Converts an array of Editor.js outputs to a single HTML string with separators
 * between each session, and downloads it as an HTML file.
 */
export function exportStudySessionsToHtml(sessions: StudySessionDto[]): string {
  // Start the base HTML document with the provided template's styling.
  // A style block is added to ensure images do not overflow the container.
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
`;

  // Process each study session.
  sessions.forEach((session) => {
    htmlContent += `
    <div style="text-align: center; margin-bottom: 2rem;">
        <h1 style="color: #1a1a1a; font-size: 2.5rem; margin-bottom: 0.5rem;">Study Sessions</h1>
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
            topic.contentJson as unknown as OutputData
          );
          topicHtml = Array.isArray(parsedBlocks)
            ? parsedBlocks.join("")
            : parsedBlocks;
        } catch (error) {
          console.error(
            `Error parsing content for topic "${topic.title}":`,
            error
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

  // Close the HTML document.
  htmlContent += `
</body>
</html>
`;

  return htmlContent;
}
