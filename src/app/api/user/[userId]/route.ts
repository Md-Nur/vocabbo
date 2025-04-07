import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const WORDS_PER_PAGE = 12;
// This function will change the word satatus
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const page = request.nextUrl.searchParams.get("page") || "1";

  if (!userId) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const words = await prisma.userWord.findMany({
    where: { userId: userId },
    orderBy: {
      lastReviewed: "desc",
    },
    include: {
      word: true,
    },
    skip: (parseInt(page!) - 1) * WORDS_PER_PAGE,
    take: WORDS_PER_PAGE,
  });
  const totalWords = await prisma.userWord.count({
    where: { userId: userId },
  });
  const totalPages = Math.ceil(totalWords / WORDS_PER_PAGE);
  return NextResponse.json(
    {
      words: words.map((word) => word.word),
      totalPages: totalPages,
    },
    { status: 200 }
  );
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const data = await request.json();

  const user = await prisma.user.update({
    where: { id: userId },
    data,
  });
  return NextResponse.json({ user }, { status: 200 });
}
