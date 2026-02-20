import type { Feeling, StudySession, Topic, User } from "@prisma/client";
import {
  decryptContentJsonText,
  decryptJournalingText,
} from "@/src/lib/crypto";
import type {
  ExportedStudySession,
  ExportedUser,
  PersonalDataExport,
} from "@/src/types/export";

// Define strict types for the input data from Prisma
type UserWithRecords = User & {
  StudySession: (StudySession & {
    topic: Topic[];
    feeling: Feeling | null;
  })[];
};

export async function serializeToJson(
  userWithRecords: UserWithRecords,
): Promise<string> {
  // 1. Sanitize User Data
  const safeUser: ExportedUser = {
    id: userWithRecords.id,
    name: userWithRecords.name,
    email: userWithRecords.email,
    emailVerified: userWithRecords.emailVerified,
    image: userWithRecords.image,
    role: userWithRecords.role,
    isTwoFactorEnabled: userWithRecords.isTwoFactorEnabled,
    createdAt: userWithRecords.createdAt,
    updatedAt: userWithRecords.updatedAt,
  };

  // 2. Map Study Sessions
  const studySessions: ExportedStudySession[] = await Promise.all(
    userWithRecords.StudySession.map(async (session) => ({
      id: session.id,
      startTime: session.startTime,
      endTime: session.endTime,
      pauseDuration: session.pauseDuration,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      topic: await Promise.all(
        session.topic.map(async (t) => ({
          id: t.id,
          sessionId: t.sessionId,
          description: t.description,
          title: t.title,
          hashtags: t.hashtags,
          timeOfStudy: t.timeOfStudy,
          createdAt: t.createdAt,
          updatedAt: t.updatedAt,
          contentJson: await decryptContentJsonText(t.contentJson),
        })),
      ),
      feeling: session.feeling
        ? {
            id: session.feeling.id,
            sessionId: session.feeling.sessionId,
            description:
              (await decryptJournalingText(session.feeling.description)) ||
              session.feeling.description,
            createdAt: session.feeling.createdAt,
            updatedAt: session.feeling.updatedAt,
          }
        : null,
    })),
  );

  // 3. Construct Final Object
  const exportData: PersonalDataExport = {
    version: 1,
    generatedAt: new Date().toISOString(),
    user: safeUser,
    records: {
      studySessions,
    },
  };

  return JSON.stringify(exportData, null, 2);
}
