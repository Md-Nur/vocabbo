import errorHandler from "@/lib/errorHandler";
import { getGroqInterests } from "@/lib/groq";
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
  const bookmark = !!parseInt(
    request?.nextUrl?.searchParams?.get("bookmark") || "0"
  );

  if (!userId) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const words = await prisma.userWord.findMany({
    where: { userId: userId, isBookmarked: bookmark ? bookmark : undefined },
    orderBy: {
      lastReviewed: "desc",
    },
    include: {
      word: true,
    },

    distinct: ["wordId"],
    skip: (parseInt(page!) - 1) * WORDS_PER_PAGE,
    take: WORDS_PER_PAGE,
  });
  const totalWords = await prisma.userWord.count({
    where: { userId: userId, isBookmarked: bookmark ? bookmark : undefined },
  });
  if (totalWords === 0) {
    return NextResponse.json({ error: "No words found" }, { status: 404 });
  }
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
  if (!userId) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  if (!data) {
    return NextResponse.json({ error: "No data provided" }, { status: 400 });
  }
  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No data provided" }, { status: 400 });
  }

  if (data.id) {
    delete data.id;
  }
  if (data.createdAt) {
    delete data.createdAt;
  }
  if (data.updatedAt) {
    delete data.updatedAt;
  }
  if (data.userId) {
    delete data.userId;
  }
  data.interests = await errorHandler(getGroqInterests(data.interests));

  const user = await errorHandler(
    prisma.user.update({
      where: { id: userId },
      data,
    })
  );
  return NextResponse.json(user, { status: 200 });
}
