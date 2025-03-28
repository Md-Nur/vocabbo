import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const quizz = await req.json();
  if (!quizz) {
    return NextResponse.json({ error: "No quizz to add" }, { status: 400 });
  }
  try {
    const newQuizz = await prisma.quizz.create({
      data: quizz,
    });
    try {
      let leaderboard = await prisma.leaderboard.findUnique({
        where: {
          userId: quizz.userId,
        },
      });
      if (leaderboard) {
        leaderboard = await prisma.leaderboard.update({
          where: {
            id: leaderboard.id,
          },
          data: {
            totalScore: leaderboard.totalScore + quizz.score,
          },
        });
      } else {
        leaderboard = await prisma.leaderboard.create({
          data: {
            userId: quizz.userId,
            totalScore: quizz.score,
          },
        });
      }
    } catch (error) {
      return NextResponse.json(error, { status: 400 });
    }
    return NextResponse.json(newQuizz, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 400 });
  }
}
