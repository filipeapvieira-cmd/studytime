import { studySessionDto } from "@/types";

// write a function that receives an array of studySessionDto and converts
// all its indexes to a string containing the markdown

export const objectToMarkdown = (studySession: studySessionDto) => {
  let markdownString = "";

  // Create a table for date, effectiveTime, and endTime
  markdownString += "| Date | Start Time | End Time | Effective Time |\n";
  markdownString += "|-------|------|----------------|----------|\n";
  markdownString += `| ${studySession.date} | ${studySession.startTime} | ${studySession.endTime} |${studySession.effectiveTime}  |\n`;

  markdownString += "\n"; // New line after table

  // Add topics
  markdownString += "### Topics\n\n";
  studySession.topics.forEach((topic, index) => {
    markdownString += `#### ${index + 1}. ${topic.title}\n`;
    markdownString += `- Description: \n`;
    markdownString += `${addSpacesToDashes(topic.description)}\n`;
    markdownString += `- Time Spent: ${convertMillisecondsToString(
      topic.effectiveTimeOfStudy
    )} \n`;
    markdownString += `- Hashtags: ${topic.hashtags}\n`;
    markdownString += "\n"; // New line between topics
  });

  // Add feelings
  markdownString += `### Feelings\n${studySession.feelings}\n\n`;

  return markdownString;
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
