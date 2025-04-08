import errorHandler from "@/lib/errorHandler";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search =
    searchParams.get("search")?.toLowerCase().trim().replace(/-/g, " ") || "";
  const page = searchParams.get("page");
  const pageNo = page ? parseInt(page) : 1;
  const filter =
    searchParams.get("filter")?.toLowerCase().trim().replace(/-/g, " ") || "";
  console.log(filter);
  const limit = 12;
  const skip = (pageNo - 1) * limit;

  const words = await errorHandler(
    prisma.word.findMany({
      where: {
        word: { contains: search, mode: "insensitive" },
        category: { contains: filter, mode: "insensitive" },
      },
      skip,
      take: limit,
      orderBy: {
        word: "asc",
      },
      distinct: ["word"],
    })
  );
  const totalWords = await errorHandler(
    // count unique words count
    prisma.word.groupBy({
      by: ["word"],
      where: {
        word: { contains: search, mode: "insensitive" },
        category: {
          contains: filter,
          mode: "insensitive",
        },
      },
      _count: true,
    })
  );
  if (totalWords.length === 0) {
    return NextResponse.json({ error: "No words found" }, { status: 404 });
  }
  const totalPages = Math.ceil(totalWords.length / limit);

  const allCategories: { category: string }[] = await errorHandler(
    prisma.word.findMany({
      distinct: ["category"],
    })
  );
  if (allCategories.length === 0) {
    return NextResponse.json({ error: "No categories found" }, { status: 404 });
  }
  const filterOptions = allCategories.map((category) => category.category);

  return NextResponse.json(
    { words, totalPages, filterOptions },
    { status: 200 }
  );
}
