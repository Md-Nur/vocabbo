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

  const learnedWords = await prisma.userWord.findMany({
    where: {
      userId: user.id,
    },
    include: {
      EnglishWord: true,
      word: true,
    },
    orderBy: {
      lastReviewed: "desc",
    },

    take: number_of_words * 3,
  });

  if (learnedWords.length === 0) {
    return NextResponse.json({ words: [], isAvailable: true }, { status: 200 });
  }
  // console.log(new Date().getTime() - new Date(learnedWords[0].lastReviewed!).getTime())
  const smallIndex =
    number_of_words < learnedWords.length
      ? number_of_words
      : learnedWords.length;
      
  const isAvailable =
    new Date().getTime() -
      new Date(learnedWords[smallIndex - 1].lastReviewed!).getTime() >
    1000 * 60 * 60 * 24;

  const words: string[] = learnedWords.map((word) => {
    if (word.EnglishWord) {
      return word.EnglishWord.englishWord;
    } else if (word.word) {
      return word.word.word;
    }
    return "";
  });
  return NextResponse.json({ words, isAvailable }, { status: 200 });
}
