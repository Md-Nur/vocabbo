import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  const user = await req.json();

  const existingUser = await prisma.user.findUnique({
    where: { email: user.email },
  });
  if (!existingUser) {
    return NextResponse.json({ error: "User doesn't exists" }, { status: 404 });
  }
  const isPasswordValid = await bcrypt.compare(
    user.password,
    existingUser.password
  );
  if (!isPasswordValid) {
    return NextResponse.json({ error: "Invalid password" }, { status: 400 });
  }
  const token = jwt.sign(
    { userId: existingUser.id },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "3d" }
  );
  const cookieStore = await cookies();

  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 3,
  });

  delete existingUser.password;

  return NextResponse.json({ user: existingUser }, { status: 200 });
}
