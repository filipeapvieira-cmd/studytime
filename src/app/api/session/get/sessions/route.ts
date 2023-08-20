import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { Topic, studySessionDto, TopicFormatted } from "@/types";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      {
        status: "error",
        message: "Unauthorized access. Please log in.",
        data: [],
      },
      { status: 401 }
    );
  }

  try {
    const studySessions = await db.user.findUnique({
      where: {
        id: +session.user.id,
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
      return NextResponse.json(
        {
          status: "error",
          message: "No study sessions found for this user.",
          data: [],
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        status: "success",
        message: "Study sessions retrieved successfully.",
        data: mapStudySession(studySessions),
      },
      { status: 200 }
    );
  } catch (error) {
    let message = "Something went wrong. Unable to retrieve sessions...";

    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json(
      {
        status: "error",
        message,
        data: [],
      },
      { status: 500 }
    );
  } finally {
    await db.$disconnect();
  }
}

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

const mapStudySession = (studySessions: any): studySessionDto[] => {
  const { StudySession: sessions } = studySessions ?? {};

  //console.log(sessions);
  //sessions.forEach((sessions) => console.log(sessions.topic));

  const studySessionDto = sessions?.map((session: any) => {
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

  return studySessionDto;
};
