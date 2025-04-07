import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { user, number_of_words } = await req.json();

  if (!user) {
    return NextResponse.json(
      { error: "User or word not found" },
      { status: 404 }
    );
  }
  let learnedWords: any[] = await prisma.word.findMany({
    take: number_of_words * 3,
    orderBy: {
      createdAt: "desc",
    },
    where: {
      addedById: user.id,
    },
    select: {
      word: true,
      createdAt: true,
    },
  });

  if (
    new Date().getTime() - new Date(learnedWords[0].createdAt).getTime() <
    1000 * 60 * 60 * 24
  ) {
    return NextResponse.json(
      { error: "You have already learned today's words" },
      { status: 402 }
    );
  }

  learnedWords = learnedWords.map((word) => word.word);
  return NextResponse.json(learnedWords, { status: 200 });
}
