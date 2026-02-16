import { NextResponse } from "next/server";
import { currentUser } from "@/src/lib/authentication";
import { db } from "@/src/lib/db";

const VALID_POLICIES = [
  "MONTHS_6",
  "MONTHS_12",
  "MONTHS_24",
  "UNTIL_DELETED",
] as const;

type PolicyValue = (typeof VALID_POLICIES)[number];

function isValidPolicy(value: unknown): value is PolicyValue {
  return (
    typeof value === "string" &&
    VALID_POLICIES.includes(value as PolicyValue)
  );
}

export async function GET() {
  const user = await currentUser();

  if (!user?.id) {
    return NextResponse.json(
      {
        status: "error",
        message: "Unauthorized access. Please log in.",
        data: null,
      },
      { status: 401 },
    );
  }

  const userId = +user.id;

  const dbUser = await db.user.findUnique({
    where: { id: userId },
    select: {
      dataRetentionPolicy: true,
      dataRetentionSetAt: true,
    },
  });

  return NextResponse.json({
    status: "success",
    data: {
      policy: dbUser?.dataRetentionPolicy ?? "UNTIL_DELETED",
      setAt: dbUser?.dataRetentionSetAt ?? null,
    },
  });
}

export async function PUT(req: Request) {
  const user = await currentUser();

  if (!user?.id) {
    return NextResponse.json(
      {
        status: "error",
        message: "Unauthorized access. Please log in.",
        data: null,
      },
      { status: 401 },
    );
  }

  const userId = +user.id;
  const body = await req.json();

  if (!isValidPolicy(body.policy)) {
    return NextResponse.json(
      {
        status: "error",
        message:
          "Invalid policy. Must be one of: MONTHS_6, MONTHS_12, MONTHS_24, UNTIL_DELETED.",
        data: null,
      },
      { status: 400 },
    );
  }

  const updated = await db.user.update({
    where: { id: userId },
    data: {
      dataRetentionPolicy: body.policy,
      dataRetentionSetAt: new Date(),
    },
    select: {
      dataRetentionPolicy: true,
      dataRetentionSetAt: true,
    },
  });

  return NextResponse.json({
    status: "success",
    message: "Data retention policy updated.",
    data: {
      policy: updated.dataRetentionPolicy,
      setAt: updated.dataRetentionSetAt,
    },
  });
}
