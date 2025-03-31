import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// This function will change the word satatus
export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  if (!params.userId) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const words = await prisma.userWord.findMany({
    where: { userId: params.userId },
  });
  return NextResponse.json(words, { status: 200 });
}
