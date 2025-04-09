import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tokenData = jwt.verify(token, process.env.JWT_SECRET || "secret") as {
    userId: string;
  };

  if (!tokenData) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const word = await prisma.word.findUnique({
    where: { id },
    include: {
      interactions: {
        where: {
          userId: tokenData.userId,
        },
      },
    },
  });
  if (!word) {
    return NextResponse.json({ error: "Word not found" }, { status: 404 });
  }
  return NextResponse.json(word, { status: 200 });
}
