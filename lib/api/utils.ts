import { FullSessionLog, FullSessionLogUpdate } from "@/types";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";

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
        ({ title, hashtags, description, effectiveTimeOfStudy }) => ({
          title,
          hashtags,
          description,
          timeOfStudy: effectiveTimeOfStudy,
        })
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
  userId: number
) => {
  const { startTime, endTime, pauseDuration, topics, feelingDescription } =
    sessionLog;

  const sessionData: Prisma.StudySessionUpdateInput = {
    startTime,
    endTime,
    pauseDuration,
    topic: {
      upsert: topics.map(
        ({ id, title, hashtags, description, effectiveTimeOfStudy }) => {
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
            },
            update: {
              title,
              hashtags,
              description,
              timeOfStudy: effectiveTimeOfStudy,
            },
          };
        }
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

export const topicsToDelete = async (sessionToUpdate: FullSessionLogUpdate) => {
  const currentTopics = await db.topic.findMany({
    where: { sessionId: sessionToUpdate.id },
  });
  const currentTopicsIds = currentTopics.map((t) => t.id);
  const topicIdsInSessionToUpdate = sessionToUpdate.topics.map((t) => t.id);
  const topicsToDelete = currentTopicsIds.filter(
    (t) => !topicIdsInSessionToUpdate.includes(t)
  );
  return topicsToDelete;
};

export const getUniqueTopicTitles = async (
  userId: number
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
