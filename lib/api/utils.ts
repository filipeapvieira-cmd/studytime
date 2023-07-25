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
    content: {
      create: topics.map(
        ({ topic, hashtags, contentDescription, timeOfStudy }) => ({
          topic,
          hashtags,
          contentDescription,
          timeOfStudy,
        })
      ),
    },
    feeling: {
      create: {
        feelingDescription,
      },
    },
  };
  return sessionData;
};
