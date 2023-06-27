import { NextResponse } from 'next/server';
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({
            status: 'error',
            message: "Unauthorized access. Please log in.",
            data: null,
        }, { status: 401 });
    }

    try {
        const studySessions = await db.user.findUnique({
            where: {
                id: +session.user.id,
            },
            include: {
                StudySession: {
                    include: {
                        content: true,
                        feeling: true
                    }
                }
            }
        });

        if (!studySessions) {
            return NextResponse.json({
                status: 'error',
                message: "No study sessions found for this user.",
                data: null,
            }, { status: 404 });
        }

        return NextResponse.json({
            status: 'success',
            message: "Study sessions retrieved successfully.",
            data: mapStudySession(studySessions),
        }, { status: 200 });
    } catch (error) {
        let message = "Something went wrong. Unable to retrieve sessions...";

        if (error instanceof Error) {
            message = error.message;
        }
        return NextResponse.json({
            status: 'error',
            message,
            data: null,
        }, { status: 500 });
    } finally {
        await db.$disconnect();
    }

}

const toDateISOString = (date: Date) => new Date(date).toISOString();
const toTimeISOString = (date: Date) => toDateISOString(date).slice(11, 19);
const toDateOnlyISOString = (date: Date) => toDateISOString(date).slice(0, 10);

const mapContent = (content: any) => ({
    text: content.contentDescription,
    topic: content.topic,
    subtopic: content.subtopic,
});

const mapStudySession = (studySessions: any) => {
    const { StudySession: sessions } = studySessions ?? {};
                
    const studySessionDto = sessions?.map((session: any) => {
        const effectiveTime = session.endTime.getTime() - (session.startTime.getTime() + session.pauseDuration);
        return {
            id: session.id,
            date: toDateOnlyISOString(session.startTime),
            startTime: toTimeISOString(session.startTime),
            endTime: toTimeISOString(session.endTime),
            pauseDuration: toTimeISOString(new Date(session.pauseDuration)),
            effectiveTime: toTimeISOString(new Date(effectiveTime)),
            content: session.content.map((content: any)=> mapContent(content)),
            feeling: session.feeling?.feelingDescription,
        }
    });

    return studySessionDto;
}