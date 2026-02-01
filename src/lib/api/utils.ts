import type { Prisma } from "@prisma/client";
import { db } from "@/src/lib/db";
import type { FullSessionLog, FullSessionLogUpdate } from "@/src/types";
import type { FlattenedError } from "@/src/types/utils.types";

export const getSessionData = (sessionLog: FullSessionLog, id: number) => {
  const { startTime, endTime, pauseDuration, topics, feelingDescription } =
    sessionLog;
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
      create: topics.map(
        ({
          title,
          hashtags,
          description,
          effectiveTimeOfStudy,
          contentJson,
        }) => ({
          title,
          hashtags,
          description: description || "",
          contentJson: contentJson || {},
          timeOfStudy: effectiveTimeOfStudy,
        }),
      ),
    },
  };

  if (feelingDescription && feelingDescription.trim() !== "") {
    sessionData.feeling = {
      create: {
        description: feelingDescription,
      },
    };
  }

  return sessionData;
};

export const getSessionUpdateData = (
  sessionLog: FullSessionLogUpdate,
  userId: number,
) => {
  const { startTime, endTime, pauseDuration, topics, feelingDescription } =
    sessionLog;

  const sessionData: Prisma.StudySessionUpdateInput = {
    startTime,
    endTime,
    pauseDuration,
    topic: {
      upsert: topics.map(
        ({
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

          return {
            where: { id },
            create: {
              title,
              hashtags,
              description,
              timeOfStudy: effectiveTimeOfStudy,
              contentJson: contentJson || {},
            },
            update: {
              title,
              hashtags,
              description,
              timeOfStudy: effectiveTimeOfStudy,
              contentJson: contentJson || {},
            },
          };
        },
      ),
    },
  };

  if (feelingDescription && feelingDescription.trim() !== "") {
    sessionData.feeling = {
      upsert: {
        create: {
          description: feelingDescription,
        },
        update: {
          description: feelingDescription,
        },
      },
    };
  }

  return sessionData;
};

export const topicsToDelete = async (
  sessionToUpdate: FullSessionLogUpdate,
  sessionId: number,
) => {
  const currentTopics = await db.topic.findMany({
    where: { sessionId },
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
