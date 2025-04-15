import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await req.json();
  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }
  const quiz = await prisma.quiz.findFirst({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  if (!quiz) {
    return NextResponse.json({ isAvailable: true }, { status: 200 });
  }
  console.log(quiz.createdAt.getTime() + 1000 * 60 * 60 * 24);
  const isAvailable =
    quiz.createdAt.getTime() + 1000 * 60 * 60 * 24 < Date.now();
  return NextResponse.json({ isAvailable }, { status: 200 });
}
