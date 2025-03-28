import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, interests: true, dificulty: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const words = await prisma.word.findMany({
    take: 10,
    where: {
      categories: {
        hasSome: user.interests,
      },
      difficulty: user.dificulty,
    },
    NOT: {
      addedById: userId,
      interactions: {
        some: {
          userId: userId,
        },
      },
    },
  });
  if (words.length < 10) {
    // more words will be ai generated for now just get other words
    const moreWords = await prisma.word.findMany({
      take: 10 - words.length,
      where: {
        difficulty: user.dificulty,
      },
      NOT: {
        addedById: userId,
        interactions: {
          some: {
            userId: userId,
          },
        },
      },
    });
    words.push(...moreWords);
  }
  const newUserWords = words.map((word: { id: string; userId: string }) => {
    return {
      userId: userId,
      wordId: word.id,
    };
  });
  await prisma.userWord.createMany({
    data: newUserWords,
  });

  return NextResponse.json({ words }, { status: 200 });
}

export async function POST(req: Request) {
  const newWords = await req.json();

  if (newWords.length === 0) {
    return NextResponse.json({ error: "No words to add" }, { status: 400 });
  }
  try {
    const words = await prisma.word.createMany({
      data: newWords,
    });
    return NextResponse.json({ words }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error adding words" }, { status: 500 });
  }
}
