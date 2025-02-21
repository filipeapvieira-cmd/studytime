import { currentUser } from "@/src/lib/authentication";
import { db } from "@/src/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await currentUser();
  const userId = user?.id;

  if (!userId) {
    return NextResponse.json(
      {
        status: "error",
        message: "Unauthorized access. Please log in.",
        data: null,
      },
      { status: 401 }
    );
  }

  const cloudinaryConfig = await db.cloudinaryConfig.findUnique({
    where: { userId: +userId },
  });

  const configObject = {
    cloudName: cloudinaryConfig?.cloudName ?? "",
    apiKey: cloudinaryConfig?.apiKey ?? "",
  };

  return NextResponse.json(configObject, { status: 200 });
}
