import errorHandler from "@/lib/errorHandler";
import { getGroqWord, getGroqWords } from "@/lib/groq";
import { imgbb } from "@/lib/imgbb";
import prisma from "@/lib/prisma";
import { getTranslateWords } from "@/lib/translate";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  let { user, learnedWords } = await req.json();

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

  if (!learnedWords.length) {
    learnedWords = [];
  }
  // more words will be ai generated for now just get other words

  let result = await errorHandler(
    getGroqWord(user.interests, user.difficulty, learnedWords)
  );

  let newWord = {
    ...result,
    addedById: user.id,
    difficulty: user.difficulty,
    imageUrl: null,
  };

  if (user?.isImgEnabled) {
    newWord.imageUrl = await errorHandler(imgbb(newWord));
  }

  const learnLanguageWord = await errorHandler(
    getTranslateWords(
      {
        word: newWord.word,
        meaning: newWord.meaning,
        exampleSentences: newWord.exampleSentences,
        category: newWord.category,
      },
      user.learningLanguage,
      "English"
    )
  );

  const transWord = await errorHandler(
    getTranslateWords(
      {
        word: newWord.word,
        meaning: newWord.meaning,
        exampleSentences: newWord.exampleSentences,
        category: newWord.category,
      },
      user.nativeLanguage,
      "English"
    )
  );
  const word = await errorHandler(
    prisma.word.create({
      data: {
        ...newWord,
        word: learnLanguageWord.word,
        meaning: learnLanguageWord.meaning,
        exampleSentences: learnLanguageWord.exampleSentences,
        category: learnLanguageWord.category,
      },
    })
  );
  const tWord = await errorHandler(
    prisma.translateWord.create({
      data: {
        userId: user.id,
        wordId: word.id,
        wordLanguage: user.learningLanguage,
        translatedWordLanguage: user.nativeLanguage,
        translatedWord: transWord.word,
        translatedMeaning: transWord.meaning,
        translatedExampleSentences: transWord.exampleSentences,
        translatedCategory: transWord.category,
      },
    })
  );

  const userWord = await errorHandler(
    prisma.userWord.create({
      data: {
        userId: user.id,
        wordId: word.id,
      },
    })
  );
  const eWord = await errorHandler(
    prisma.englishWord.create({
      data: {
        wordId: word.id,
        wordLanguage: user.learningLanguage,
        englishWord: newWord.word,
        englishMeaning: newWord.meaning,
        englishExampleSentences: newWord.exampleSentences,
        englishCategory: newWord.category,
        userId: user.id,
        userWordId: userWord.id,
      },
    })
  );
  return NextResponse.json(
    {
      ...word,
      interactions: [userWord],
      translateWord: [tWord],
      englishWord: eWord,
    },
    { status: 201 }
  );
}
