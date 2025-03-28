import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const word = await prisma.word.findUnique({
    where: { id: params.id },
  });
  if (!word) {
    return new Response("Word not found", { status: 404 });
  }
  return NextResponse.json(word, { status: 200 });
}

