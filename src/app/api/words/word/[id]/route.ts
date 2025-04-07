import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const word = await prisma.word.findUnique({
    where: { id },
  });
  if (!word) {
    return new Response("Word not found", { status: 404 });
  }
  return NextResponse.json(word, { status: 200 });
}

