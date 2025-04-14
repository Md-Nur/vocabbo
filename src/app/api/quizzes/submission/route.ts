import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import errorHandler from "@/lib/errorHandler";

export async function POST(req: Request) {
  // Take and validate the data from the request
  const { userId, quizAttempt, quiz, quizQuestions } = await req.json();
  if (!userId || !quizAttempt.id || !quiz.id || !quizQuestions.length) {
    return NextResponse.json(
      { error: "Please provide necessary information" },
      { status: 400 }
    );
  }

  // Process all questions and calculate score
  let score = 0;

  const results = await Promise.all(
    quizQuestions.map(async (question: { id: string; answer?: string }) => {
      if (!question.id) {
        throw new Error("Please provide questionId");
      }

      // Find the quiz question with correct answers
      const quizQuestion = await errorHandler(
        prisma.quizQuestion.findUnique({
          where: {
            id: question.id,
          },
        })
      );

      if (!quizQuestion) {
        return NextResponse.json(
          { error: `Question not found: ${question.id}` },
          { status: 404 }
        );
      }

      // Check the answers with the correct answers
      const isCorrect =
        question.answer?.trim().toLowerCase() ===
        quizQuestion.correctAnswer.trim().toLowerCase();

      if (isCorrect) {
        score += quizQuestion.points;
      }

      // Create the quiz result
      return errorHandler(
        prisma.quizResult.create({
          data: {
            attemptId: quizAttempt.id,
            questionId: question.id,
            userId: userId,
            userAnswer: question.answer,
            isCorrect: isCorrect,
          },
        })
      );
    })
  );

  // Update the leaderboard without waiting for the response
  errorHandler(
    prisma.leaderboard.update({
      where: { userId: userId },
      data: {
        totalScore: {
          increment: score,
        },
      },
    })
  );

  // Update the quiz attempt with the score and status
  await errorHandler(
    prisma.quizAttempt.update({
      where: {
        id: quizAttempt.id,
      },
      data: {
        score: score,
        status: "COMPLETED",
        completedAt: new Date(),
      },
    })
  );

  // Fetch the complete quiz with results
  const quizz = await errorHandler(
    prisma.quiz.findUnique({
      where: {
        id: quiz.id,
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
          orderBy: {
            createdAt: "asc",
          },
        },
        attempts: true,
      },
    })
  );

  if (!quizz) {
    return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
  }

  return NextResponse.json(quizz, { status: 200 });
}
