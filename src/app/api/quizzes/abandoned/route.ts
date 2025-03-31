import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import errorHandler from "@/lib/errorHandler";

export async function POST(req: Request) {
  // Taka and valided the data from the request
  const { quizAttempt } = await req.json();
  if (!quizAttempt.id) {
    return NextResponse.json(
      { error: "Please provide necessary information" },
      { status: 400 }
    );
  }
  await errorHandler(
    prisma.quizAttempt.update({
      where: {
        id: quizAttempt.id,
      },
      data: {
        score: 0,
        status: "ABANDONED",
        completedAt: new Date(),
      },
    })
  );
}
