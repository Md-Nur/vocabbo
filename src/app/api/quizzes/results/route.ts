import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { useAppSelector } from "@/store/hooks";

export async function GET(req: Request) {
  const user = useAppSelector((state) => state.user.user);
  const quizResults = await prisma.quizResult.findMany({
    where: {
      userId: user?.id,
    },
  });
  return NextResponse.json(quizResults);
}
