import type { Feeling, StudySession, Topic, User } from "@prisma/client";
import { decryptJournalingText } from "@/src/lib/crypto";

// Define strict types for the input data from Prisma
type UserWithRecords = User & {
  StudySession: (StudySession & {
    topic: Topic[];
    feeling: Feeling | null;
  })[];
};

export async function serializeToCsv(
  userWithRecords: UserWithRecords,
): Promise<string> {
  const headers = [
    "Session ID",
    "Start Time",
    "End Time",
    "Pause Duration (ms)",
    "Created At",
    "Topics (Title | Time)",
    "Feeling",
  ];

  const rows = await Promise.all(
    userWithRecords.StudySession.map(async (session) => {
      // Format topics as a single string: "Math | 30m; Science | 45m"
      const topicsString = session.topic
        .map((t) => `${t.title} (${t.timeOfStudy}ms)`)
        .join("; ");

      const feelingString = session.feeling
        ? await decryptJournalingText(session.feeling.description)
        : "";

      return [
        session.id,
        session.startTime.toISOString(),
        session.endTime.toISOString(),
        session.pauseDuration,
        session.createdAt.toISOString(),
        topicsString,
        feelingString,
      ];
    }),
  );

  // Combine headers and rows
  const csvContent = [
    headers.join(","), // Header row
    ...rows.map((row) => row.map(escapeCsvValue).join(",")), // Data rows
  ].join("\n");

  return csvContent;
}

/**
 * Escapes a value for CSV format.
 * - Wraps in quotes if it contains commas, newlines, or quotes.
 * - Escapes existing quotes by doubling them.
 */
function escapeCsvValue(value: string | number | null | undefined): string {
  if (value === null || value === undefined) {
    return "";
  }

  const stringValue = String(value);

  if (
    stringValue.includes(",") ||
    stringValue.includes("\n") ||
    stringValue.includes('"')
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}
