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
            data: studySessions,
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