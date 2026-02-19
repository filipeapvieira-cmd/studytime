import type { Prisma } from "@prisma/client";
import { encryptJournalingText } from "@/src/lib/crypto";
import { db } from "@/src/lib/db";
import type { FullSessionLog, FullSessionLogUpdate } from "@/src/types";
import type { FlattenedError } from "@/src/types/utils.types";

export const getSessionData = async (
  sessionLog: FullSessionLog,
  id: number,
): Promise<Prisma.StudySessionCreateInput> => {
  const { startTime, endTime, pauseDuration, topics, feelingDescription } =
    sessionLog;

  const encryptedTopics = await Promise.all(
    topics.map(
      async ({
        title,
        hashtags,
        description,
        effectiveTimeOfStudy,
        contentJson,
      }) => ({
        title,
        hashtags,
        description: (await encryptJournalingText(description || "")) || "",
        contentJson: contentJson || {},
        timeOfStudy: effectiveTimeOfStudy,
      }),
    ),
  );

  const sessionData: Prisma.StudySessionCreateInput = {
    startTime,
    endTime,
    user: {
      connect: {
        id,
      },
    },
    pauseDuration,
    topic: {
      create: encryptedTopics,
    },
  };

  if (feelingDescription && feelingDescription.trim() !== "") {
    const encryptedFeeling =
      (await encryptJournalingText(feelingDescription)) || feelingDescription;

    sessionData.feeling = {
      create: {
        description: encryptedFeeling,
      },
    };
  }

  return sessionData;
};

export const getSessionUpdateData = async (
  sessionLog: FullSessionLogUpdate,
): Promise<Prisma.StudySessionUpdateInput> => {
  const { startTime, endTime, pauseDuration, topics, feelingDescription } =
    sessionLog;

  const encryptedTopics = await Promise.all(
    topics.map(
      async ({
        id,
        title,
        hashtags,
        description,
        effectiveTimeOfStudy,
        contentJson,
      }) => {
        if (typeof id !== "number") {
          throw new Error(`Invalid topic ID: ${id}`);
        }

        const encryptedDescription = await encryptJournalingText(
          description || "",
        );

        return {
          where: { id },
          create: {
            title,
            hashtags,
            description: encryptedDescription || "",
            timeOfStudy: effectiveTimeOfStudy,
            contentJson: contentJson || {},
          },
          update: {
            title,
            hashtags,
            description: encryptedDescription || "",
            timeOfStudy: effectiveTimeOfStudy,
            contentJson: contentJson || {},
          },
        };
      },
    ),
  );

  const sessionData: Prisma.StudySessionUpdateInput = {
    startTime,
    endTime,
    pauseDuration,
    topic: {
      upsert: encryptedTopics,
    },
  };

  if (feelingDescription && feelingDescription.trim() !== "") {
    const encryptedFeeling =
      (await encryptJournalingText(feelingDescription)) || feelingDescription;

    sessionData.feeling = {
      upsert: {
        create: {
          description: encryptedFeeling,
        },
        update: {
          description: encryptedFeeling,
        },
      },
    };
  }

  return sessionData;
};

export const topicsToDelete = async (
  sessionToUpdate: FullSessionLogUpdate,
  sessionId: number,
  userId: number,
) => {
  const currentTopics = await db.topic.findMany({
    where: {
      sessionId,
      studySession: { userId },
    },
  });
  const currentTopicsIds = currentTopics.map((t) => t.id);
  const topicIdsInSessionToUpdate = sessionToUpdate.topics.map((t) => t.id);
  const topicsToDelete = currentTopicsIds.filter(
    (t) => !topicIdsInSessionToUpdate.includes(t),
  );
  return topicsToDelete;
};

export const getUniqueTopicTitles = async (
  userId: number,
): Promise<string[]> => {
  const topics = await db.topic.findMany({
    where: {
      studySession: {
        userId: userId, // Filter topics through their associated StudySession by the userId
      },
    },
    select: {
      title: true, // Only select the title field
    },
    distinct: ["title"], // Ensure that the titles are unique
    orderBy: {
      title: "asc",
    },
  });

  return topics.map((topic) => topic.title);
};

export const getUniqueHashtags = async (userId: number): Promise<string[]> => {
  const hashtags = await db.topic.findMany({
    where: {
      studySession: {
        userId: userId, // Filter topics through their associated StudySession by the userId
      },
    },
    select: {
      hashtags: true, // Only select the title field
    },
    distinct: ["hashtags"],
    orderBy: {
      title: "asc",
    },
  });

  const allHashtags = hashtags
    .flatMap(({ hashtags }) => (hashtags ? hashtags.split(" ") : []))
    .filter((value, index, self) => self.indexOf(value) === index)
    .sort();

  return allHashtags;
};

export function getFirstErrorMessage(error: FlattenedError): string {
  if (error.formErrors && error.formErrors.length > 0) {
    return error.formErrors[0];
  }

  for (const key in error.fieldErrors) {
    const messages = error.fieldErrors[key];
    if (messages && messages.length > 0) {
      return messages[0];
    }
  }

  return "An unknown error occurred.";
}
