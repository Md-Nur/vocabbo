import errorHandler from "@/lib/errorHandler";
import { getGroqWords } from "@/lib/groq";
import { imgbb } from "@/lib/imgbb";
import prisma from "@/lib/prisma";
import { getTranslateWords } from "@/lib/translate";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  let { user, number_of_words, learnedWords } = await req.json();

  if (
    !user ||
    !user.id ||
    !user.interests ||
    !user.difficulty ||
    !user.learningLanguage ||
    !learnedWords
  ) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (!number_of_words) {
    number_of_words = 100;
  }

  if (!learnedWords.length) {
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
    // if (result.length !== number_of_words) {
    //   console.error(
    //     `Expected ${number_of_words} words but got ${result.length}`
    //   );
    //   return NextResponse.json(
    //     { error: `Failed to generate exactly ${number_of_words} words` },
    //     { status: 500 }
    //   );
    // }

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
            if (user?.isImgEnabled) {
              newWord.imageUrl = await imgbb(newWord);
            } else {
              newWord.imageUrl = null;
            }
          } catch (error) {
            console.error("Error uploading image:", error);
            newWord.imageUrl = null;
          }

          try {
            const learnLanguageWord = await getTranslateWords(
              {
                word: newWord.word,
                meaning: newWord.meaning,
                exampleSentences: newWord.exampleSentences,
                category: newWord.category,
              },
              user.learningLanguage,
              "English"
            );
            var word = await prisma.word.create({
              data: {
                ...newWord,
                word: learnLanguageWord.word,
                meaning: learnLanguageWord.meaning,
                exampleSentences: learnLanguageWord.exampleSentences,
                category: learnLanguageWord.category,
              },
            });
            const translateWord = await getTranslateWords(
              {
                word: newWord.word,
                meaning: newWord.meaning,
                exampleSentences: newWord.exampleSentences,
                category: newWord.category,
              },
              user.nativeLanguage,
              "English"
            );
            await prisma.translateWord.create({
              data: {
                userId: user.id,
                wordId: word.id,
                wordLanguage: user.learningLanguage,
                translatedWordLanguage: user.nativeLanguage,
                translatedWord: translateWord.word,
                translatedMeaning: translateWord.meaning,
                translatedExampleSentences: translateWord.exampleSentences,
                translatedCategory: translateWord.category,
              },
            });
          } catch (error) {
            console.error("Error creating word:", error);
            return NextResponse.json(
              { error: "Failed to create word" },
              { status: 500 }
            );
          }

          await errorHandler(
            prisma.userWord.create({
              data: {
                userId: user.id,
                wordId: word.id,
              },
            })
          );

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
