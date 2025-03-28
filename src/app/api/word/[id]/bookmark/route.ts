import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const userWord = await req.json();

  const word = await prisma.word.findUnique({
    where: { id: params.id },
  });
  if (!word) {
    return new Response("Word not found", { status: 404 });
  }
  let newUserWord = await prisma.userWord.findUnique({
    where: {
      userId: userWord.userId,
      wordId: word.id,
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
        isBookmarked: word.isBookmarked,
      },
    });
  }
  return NextResponse.json(newUserWord, { status: 200 });
}
