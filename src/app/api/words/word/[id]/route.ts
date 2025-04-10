import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await request.json();

  const word = await prisma.word.findUnique({
    where: { id },
    include: {
      interactions: {
        where: {
          userId: user.userId,
        },
      },
      translateWord: {
        where: {
          OR: [
            {
              wordLanguage: user.nativeLanguage,
            },
            {
              translatedWordLanguage: user.nativeLanguage,
            },
            {
              wordLanguage: user.learningLanguage,
            },
            {
              translatedWordLanguage: user.learningLanguage,
            },
            {
              wordLanguage: "English",
            },
            {
              translatedWordLanguage: "English",
            },
          ],
        },
      },
    },
  });

  if (!word) {
    return NextResponse.json({ error: "Word not found" }, { status: 404 });
  }
  return NextResponse.json(word, { status: 200 });
}
