import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// This function will change the word satatus
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  if (!userId) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const words = await prisma.userWord.findMany({
    where: { userId: userId },
    include: {
      word: true,
    },
  });
  return NextResponse.json(
    words.map((word) => word.word),
    { status: 200 }
  );
}
