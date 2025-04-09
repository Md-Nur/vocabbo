import prisma from "@/lib/prisma";
import { UserWord } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userWord: { userId: string; isBookmarked: boolean } =
    await request.json();

  const word = await prisma.word.findUnique({
    where: { id },
  });
  if (!word) {
    return new Response("Word not found", { status: 404 });
  }
  let newUserWord = await prisma.userWord.findUnique({
    where: {
      userId_wordId: {
        userId: userWord.userId,
        wordId: word.id,
      },
    },
  });
  if (newUserWord) {
    newUserWord = await prisma.userWord.update({
      where: {
        id: newUserWord.id,
      },
      data: {
        isBookmarked: userWord.isBookmarked,
      },
    });
  } else {
    newUserWord = await prisma.userWord.create({
      data: {
        userId: userWord.userId,
        wordId: word.id,
        isBookmarked: userWord.isBookmarked,
      },
    });
  }
  return NextResponse.json(
    { isBookmarked: newUserWord.isBookmarked },
    { status: 200 }
  );
}
