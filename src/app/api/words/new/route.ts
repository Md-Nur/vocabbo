import { getGroqWords } from "@/lib/groq";
import { imgbb } from "@/lib/imgbb";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  let { user, number_of_words, learnedWords } = await req.json();

  if (!user || !user.id || !user.interests || !user.difficulty) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  console.log(user, number_of_words);
  if (!number_of_words) {
    number_of_words = 100;
  }
  if (!learnedWords) {
    learnedWords = [];
  }
  // more words will be ai generated for now just get other words
  try {
    const result = await getGroqWords(
      number_of_words,
      user.interests,
      user.difficulty,
      learnedWords
    );

    // Validate that we got exactly the requested number of words
    if (result.length !== number_of_words) {
      console.error(
        `Expected ${number_of_words} words but got ${result.length}`
      );
      return NextResponse.json(
        { error: `Failed to generate exactly ${number_of_words} words` },
        { status: 500 }
      );
    }

    var newWords = result.map(
      (word: {
        word: string;
        meaning: string;
        exampleSentences: string[];
        category: string;
        prompt: string;
      }) => {
        return {
          ...word,
          addedById: user.id,
          difficulty: user.difficulty,
          imageUrl: null,
        };
      }
    );
  } catch (error) {
    console.error("Error generating words:", error);
    return NextResponse.json(
      { error: "Failed to generate words" },
      { status: 500 }
    );
  }
  try {
    const encoder = new TextEncoder();
    const strem = new ReadableStream({
      async start(controller) {
        for (const newWord of newWords) {
          try {
            if (false) {
              newWord.imageUrl = await imgbb(newWord);
            } else {
              newWord.imageUrl = null;
            }
          } catch (error) {
            console.error("Error uploading image:", error);
            newWord.imageUrl = null;
          }

          try {
            var word = await prisma.word.create({
              data: newWord,
            });
          } catch (error) {
            console.error("Error creating word:", error);
            return NextResponse.json(
              { error: "Failed to create word" },
              { status: 500 }
            );
          }
          try {
            await prisma.userWord.create({
              data: {
                userId: user.id,
                wordId: word.id,
              },
            });
          } catch (error) {
            console.error("Error creating user word:", error);
            return NextResponse.json(
              { error: "Failed to create user word" },
              { status: 500 }
            );
          }
          controller.enqueue(encoder.encode(JSON.stringify(word) + "\n"));
        }
        controller.close();
      },
    });
    return new NextResponse(strem, {
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) {
    console.error("Error adding words:", error);
    return NextResponse.json({ error: "Failed to add words" }, { status: 500 });
  }
}
