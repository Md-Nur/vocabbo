import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getGroqChatCompletion } from "@/lib/groq";

export async function POST(req: Request) {
  const user = await req.json();

  if (!user.email || !user.password || !user.name || !user.interests) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 400 }
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: user.email },
  });
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }
  user.password = await bcrypt.hash(user.password, 10);
  // AI task: Generate interests based on user input
  const prompt = `
  Extract interests from the user's input as a JSON array. Follow these rules:
  1. Output ONLY a valid JSON array like ["interest1", "interest2"].
  2. Ignore non-interest words (e.g., "I like", "my dream").
  3. If no interests, return [].

  Input: "${user.interests}"
  Output:
  `;

  const result = (await getGroqChatCompletion(prompt)) || "";
  const parsedResult = JSON.parse(result);
  const interests = parsedResult.map((interest: string) => interest.trim());
  user.interests = interests;

  // Create user in the database
  const newUser = await prisma.user.create({
    data: user,
  });

  const token = jwt.sign(
    { userId: newUser.id },
    process.env.JWT_SECRET || "secret",
    {
      expiresIn: "3d",
    }
  );
  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 3,
  });

  const { password, createdAt, ...userWithoutSensitiveData } = newUser;
  return NextResponse.json({ user: userWithoutSensitiveData }, { status: 201 });
}

export async function GET(req: Request) {
  const userInput =
    "I like to play football and my dream is to travel the world.";
  const prompt = `
  Extract interests from the user's input as a JSON array. Follow these rules:
  1. Output ONLY a valid JSON array like ["interest1", "interest2"].
  2. Ignore non-interest words (e.g., "I like", "my dream").
  3. If no interests, return [].

  Input: "${userInput}"
  Output:
  `;
  const result = (await getGroqChatCompletion(prompt)) || "";
  const parsedResult = JSON.parse(result);
  const interests = parsedResult.map((interest: string) => interest.trim());
  return NextResponse.json(interests, { status: 200 });
}
