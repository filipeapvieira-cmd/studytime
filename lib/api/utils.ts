import { FullSessionLog } from "@/types";
import { Prisma } from "@prisma/client";

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
      create: topics.map(({ title, hashtags, description, timeOfStudy }) => ({
        title,
        hashtags,
        description,
        timeOfStudy,
      })),
    },
    feeling: {
      create: {
        description: feelingDescription,
      },
    },
  };
  return sessionData;
};
