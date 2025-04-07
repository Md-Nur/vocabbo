import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { UserWord } from "@prisma/client";

export async function POST(req: Request) {
  const { user, number_of_words } = await req.json();

  if (!user) {
    return NextResponse.json(
      { error: "User or word not found" },
      { status: 404 }
    );
  }

  const learnedWords = await prisma.userWord.findMany({
    where: {
      userId: user.id,
    },
    select: {
      word: true,
      lastReviewed: true,
    },
    orderBy: {
      lastReviewed: "desc",
    },
    take: number_of_words * 3,
  });

  if (learnedWords.length === 0) {
    return NextResponse.json([], { status: 200 });
  }
  if (
    new Date().getTime() - new Date(learnedWords[0].lastReviewed!).getTime() <
    1000 * 60 * 60 * 24
  ) {
    return NextResponse.json(
      { error: "You have already learned today's words" },
      { status: 402 }
    );
  }

  const words: string[] = learnedWords.map((word) => word.word.word);
  return NextResponse.json(words, { status: 200 });
}
