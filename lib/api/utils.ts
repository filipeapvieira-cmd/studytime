import { SessionTimeAndDate, SessionLogTopicContentFeelings } from "@/types";
import { Prisma } from "@prisma/client";

export const getSessionData = (
  description: SessionLogTopicContentFeelings,
  timeAndDate: SessionTimeAndDate,
  id: number
) => {
  const sessionData: Prisma.StudySessionCreateInput = {
    startTime: timeAndDate.startTime,
    endTime: timeAndDate.endTime,
    user: {
      connect: {
        id,
      },
    },
    pauseDuration: timeAndDate.pausedTime,
    content: {
      create: description.topics.map((topic) => ({
        topic: topic.topic,
        subtopic: topic.subtopic,
        contentDescription: topic.content,
      })),
    },
    feeling: {
      create: {
        feelingDescription: description.feelings,
      },
    },
  };
  return sessionData;
};
