import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { SessionTimeAndDate, SessionLogTopicContentFeelings } from "@/types";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";

export async function PUT(req: Request, context: any) {
    const { params } = context;
    const id = params.sessionId;

    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({
            status: 'error',
            message: "Unauthorized access. Please log in.",
            data: null,
        }, { status: 401 });
    }

    const { description, timeAndDate }: { description: SessionLogTopicContentFeelings, timeAndDate: SessionTimeAndDate } = await req.json();
    // Prisma's transaction API to create related data in one go
    try {
         const sessionData: Prisma.StudySessionUpdateInput = {
            startTime: timeAndDate.startTime,
            endTime: timeAndDate.endTime,
            user: {
                connect: {
                    id: +session.user.id,
                }
            },
            pauseDuration: timeAndDate.pausedTime,
            content: {
                create: description.topics.map(topic => ({
                    topic: topic.topic,
                    subtopic: topic.subtopic,
                    contentDescription: topic.content,
                }))
            },
            feeling: {
                create: {
                    feelingDescription: description.feelings,
                }
            }
        } 

        await db.studySession.update({ 
            where: {id: +id},
            data: sessionData });

        return NextResponse.json({
            status: 'success',
            message: "Session saved successfully",
            data: null,
        }, { status: 200 });

    } catch (error) {
        let message = "Something went wrong. Unable to save session...";

        if (error instanceof Error) {
            message = error.message;
        }

        return NextResponse.json({
            status: 'error',
            message,
            data: null,
        }, { status: 400 });

    } finally {
        await db.$disconnect();
    }
}