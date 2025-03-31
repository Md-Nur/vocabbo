import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getGroqInterests } from "@/lib/groq";

export async function POST(req: Request) {
  const user = await req.json();

  if (
    !user.email ||
    !user.password ||
    !user.name ||
    !user.interests ||
    !user.difficulty
  ) {
    return NextResponse.json(
      { error: "Insufficeint information" },
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
  try {
    user.interests = await getGroqInterests(user.interests);
  } catch (error) {
    console.error("Error generating interests:", error);
    return NextResponse.json(
      { error: "Failed to generate interests" },
      { status: 500 }
    );
  }
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

  await prisma.leaderboard.create({
    data: {
      userId: newUser.id,
      totalScore: 0,
    },
  });

  const { password, createdAt, ...userWithoutSensitiveData } = newUser;
  return NextResponse.json(userWithoutSensitiveData, { status: 201 });
}
