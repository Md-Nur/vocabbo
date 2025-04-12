import errorHandler from "@/lib/errorHandler";
import { getGroqQuiz } from "@/lib/groq";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Take the necessary information for the quiz
  const quizz = await req.json();
  if (
    !quizz ||
    !quizz.userId ||
    !quizz.duration ||
    !quizz.difficulty ||
    !quizz.learningLanguage
  ) {
    return NextResponse.json(
      { error: "Please provide necessary information" },
      { status: 400 }
    );
  }

  // Collect the learned words from the database
  let learnedWords = await errorHandler(
    prisma.userWord.findMany({
      where: {
        userId: quizz.userId,
      },
      select: {
        word: true,
      },
    })
  );
  if (learnedWords.length === 0) {
    learnedWords = await errorHandler(prisma.word.findMany({}));
  }

  const learnedWordsArray = learnedWords.map(
    (word: { word: { word: string } }) => word.word.word
  );

  // Generate quiz with Groq API
  const quizWithQuestions = await errorHandler(
    getGroqQuiz(
      learnedWordsArray,
      quizz.difficulty,
      quizz.duration,
      quizz.learningLanguage
    )
  );

  // Insert data in quiz table
  const newQuizz = await errorHandler(
    prisma.quiz.create({
      data: {
        duration: quizz.duration,
        difficulty: quizz.difficulty,
        userId: quizz.userId,
      },
    })
  );

  // Insert data in quizAttempt table
  const quizAttempt = await errorHandler(
    prisma.quizAttempt.create({
      data: {
        quizId: newQuizz.id,
        userId: quizz.userId,
        status: "IN_PROGRESS",
        totalScore: quizWithQuestions.questions.reduce(
          (acc: number, question: any) => acc + question.points,
          0
        ),
      },
    })
  );

  // Insert data in quizQuestion table
  const quizQuestions = await errorHandler(
    prisma.quizQuestion.createManyAndReturn({
      data: quizWithQuestions.questions.map(
        (question: {
          questionType: string;
          questionText: string;
          options?: string[];
          correctAnswer: string;
          explanation: string;
          points: number;
        }) => ({
          quizId: newQuizz.id,
          ...question,
        })
      ),
    })
  );

  // Send the questions after filtering
  const filteredQuestions = {
    userId: quizz.userId,
    quizAttempt: quizAttempt,
    quiz: newQuizz,
    quizQuestions: quizQuestions.map((question: any) => {
      const { correctAnswer, explanation, ...rest } = question;
      return { ...rest, answer: "" };
    }),
  };
  return NextResponse.json(filteredQuestions, { status: 200 });
}
