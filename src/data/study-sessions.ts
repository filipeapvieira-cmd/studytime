import { db } from "@/src/lib/db";
import type { StudySessionDto } from "@/src/types";
import { currentUser } from "../lib/authentication";
import type { StudySessionsResponse } from "../types/study-sessions";

export const getStudySessionsByUserId =
  async (): Promise<StudySessionsResponse> => {
    const user = await currentUser();
    const userId = user?.id;

    if (!userId) {
      return {
        status: "error",
        message: "Unauthorized access. Please log in.",
        data: [],
      };
    }

    try {
      const studySessions = await db.user.findUnique({
        where: {
          id: parseInt(userId),
        },
        include: {
          StudySession: {
            include: {
              topic: true,
              feeling: true,
            },
          },
        },
      });

      if (!studySessions) {
        return {
          status: "error",
          message: "No study sessions found for this user.",
          data: [],
        };
      }

      return {
        status: "success",
        message: "Study sessions retrieved successfully.",
        data: mapStudySession(studySessions),
      };
    } catch (error) {
      let message = "Something went wrong. Unable to retrieve sessions...";

      if (error instanceof Error) {
        message = error.message;
      }

      return {
        status: "error",
        message,
        data: [],
      };
    } finally {
      await db.$disconnect();
    }
  };

const toDateISOString = (date: Date) => new Date(date).toISOString();
const toTimeISOString = (date: Date) => toDateISOString(date).slice(11, 19);
const toDateOnlyISOString = (date: Date) => toDateISOString(date).slice(0, 10);

const mapTopics = (topic: any) => ({
  id: topic.id,
  description: topic.description,
  title: topic.title,
  hashtags: topic.hashtags,
  effectiveTimeOfStudy: topic.timeOfStudy,
});

const mapStudySession = (studySessions: any): StudySessionDto[] => {
  const { StudySession: sessions } = studySessions ?? {};

  //console.log(sessions);
  //sessions.forEach((sessions) => console.log(sessions.topic));

  const StudySessionDto = sessions?.map((session: any) => {
    const effectiveTime =
      session.endTime.getTime() -
      (session.startTime.getTime() + session.pauseDuration);
    return {
      id: session.id,
      date: toDateOnlyISOString(session.startTime),
      startTime: toTimeISOString(session.startTime),
      endTime: toTimeISOString(session.endTime),
      pauseDuration: toTimeISOString(new Date(session.pauseDuration)),
      effectiveTime: toTimeISOString(new Date(effectiveTime)),
      topics: session.topic.map((topic: any) => mapTopics(topic)),
      feelings: session.feeling?.description,
    };
  });

  return StudySessionDto;
};
