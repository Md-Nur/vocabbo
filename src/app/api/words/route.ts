import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const words = await prisma.word.findMany();
  return NextResponse.json(words);
}
