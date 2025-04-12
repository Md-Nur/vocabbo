import errorHandler from "@/lib/errorHandler";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const quizAttempt = await errorHandler(
    prisma.quizAttempt.findUnique({
      where: {
        quizId: id,
      },
    })
  );
  const quizResult = await errorHandler(
    prisma.quiz.findUnique({
      where: {
        id: id,
      },
      include: {
        questions: {
          include: {
            QuizResult: {
              where: {
                attemptId: quizAttempt.id,
              },
            },
          },
        },
        attempts: true,
      },
    })
  );

  return NextResponse.json(quizResult);
}
