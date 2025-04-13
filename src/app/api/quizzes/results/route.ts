import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { useAppSelector } from "@/store/hooks";

export async function POST(req: Request) {
  const { userId } = await req.json();
  const quizResults = await prisma.quizAttempt.findMany({
    where: {
      userId,
      status: {
        not: "IN_PROGRESS",
      },
    },
    include: {
      quiz: true,
    },
    orderBy: {
      startedAt: "desc",
    },
  });
  return NextResponse.json(quizResults);
}
