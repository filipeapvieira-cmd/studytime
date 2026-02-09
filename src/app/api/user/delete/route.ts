import { type NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/src/lib/authentication";
import { db } from "@/src/lib/db";

export async function DELETE(req: NextRequest) {
  const user = await currentUser();

  if (!user || !user.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userId = Number(user.id);

  try {
    // Delete the user - Prisma cascade will handle related records
    await db.user.delete({
      where: { id: userId },
    });

    const deletionTime = new Date().toISOString();

    return NextResponse.json({
      success: true,
      deletedAt: deletionTime,
    });
  } catch (error) {
    console.error("Delete account error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
