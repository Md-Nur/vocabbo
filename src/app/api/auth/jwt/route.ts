import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  const cookieStore = await cookies();
  let token = cookieStore.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const userId: any = jwt.verify(token, process.env.JWT_SECRET || "secret");
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const existingUser = await prisma.user.findUnique({
    where: { id: userId.userId },
  });
  if (!existingUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { password, ...userWithoutPassword } = existingUser;

  token = jwt.sign(
    { userId: existingUser.id },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "3d" }
  );

  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 3,
  });
  return NextResponse.json(userWithoutPassword, { status: 200 });
}
