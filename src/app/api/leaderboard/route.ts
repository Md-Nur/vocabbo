import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const leaderboard = await prisma.leaderboard.findMany({
    orderBy: {
      totalScore: "desc",
    },
  });
  return NextResponse.json(leaderboard, { status: 200 });
}

export async function POST(req: Request) {
  const leaderboard = await req.json();
  if (!leaderboard) {
    return NextResponse.json(
      { error: "No leaderboard to add" },
      { status: 400 }
    );
  }
  try {
    const newLeaderboard = await prisma.leaderboard.create({
      data: leaderboard,
    });
    return NextResponse.json(newLeaderboard, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 400 });
  }
}

