import { studySessionDto } from "@/types";

const convertSessionsToMarkdown = (sessionsToExport: studySessionDto[]) => {
  let markdownString = "";
  sessionsToExport.forEach(
    (session, index) => (markdownString += sessionToMarkdown(session, index))
  );
  return markdownString;
};

const sessionToMarkdown = (studySession: studySessionDto, index: number) => {
  let markdownString = "";

  markdownString += `\n# Session Number: ${index + 1}\n\n`;

  // Create a table for date, effectiveTime, and endTime
  markdownString += "| Date | Start Time | End Time | Effective Time |\n";
  markdownString += "|-------|------|----------------|----------|\n";
  markdownString += `| ${studySession.date} | ${studySession.startTime} | ${studySession.endTime} |${studySession.effectiveTime}  |\n`;

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

const convertMillisecondsToString = (milliseconds: number) => {
  const seconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
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

export const exportFile = (table: any) => {
  const filteredRows = table.getRowModel().rows;
  const sessionsToExport: studySessionDto[] = filteredRows.map(
    (row: any) => row.original
  );
  const markdown = convertSessionsToMarkdown(sessionsToExport);
  downloadMarkdownFile(markdown);
  //console.log(markdown);
};
