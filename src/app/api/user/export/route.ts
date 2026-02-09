import { type NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/src/lib/authentication";
import { db } from "@/src/lib/db";
import { serializeToCsv } from "@/src/lib/export/csv-serializer";
import { serializeToJson } from "@/src/lib/export/json-serializer";

export async function GET(req: NextRequest) {
  const user = await currentUser();

  if (!user || !user.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userId = Number(user.id);
  const searchParams = req.nextUrl.searchParams;
  const format = searchParams.get("format") || "json";

  if (format !== "json" && format !== "csv") {
    return new NextResponse("Invalid format. Use 'json' or 'csv'.", {
      status: 400,
    });
  }

  try {
    const userWithRecords = await db.user.findUnique({
      where: { id: userId },
      include: {
        StudySession: {
          take: 10000, // Limit to prevent memory issues
          orderBy: { startTime: "desc" },
          include: {
            topic: true,
            feeling: true,
          },
        },
      },
    });

    if (!userWithRecords) {
      return new NextResponse("User not found", { status: 404 });
    }

    const filename = `studytime-export-${new Date().toISOString().slice(0, 10)}`;
    let content = "";
    let contentType = "";

    if (format === "json") {
      content = serializeToJson(userWithRecords);
      contentType = "application/json; charset=utf-8";
    } else {
      content = serializeToCsv(userWithRecords);
      contentType = "text/csv; charset=utf-8";
    }

    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}.${format}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
