import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  const user = await req.json();

  if (!user.email || !user.password) {
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

  delete newUser.password;
  delete newUser.createdAt;
  return NextResponse.json({ user: newUser }, { status: 201 });
}
