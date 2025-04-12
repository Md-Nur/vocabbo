import { groq } from "@ai-sdk/groq";
import { generateObject } from "ai";
import { z } from "zod";

export async function getGroqWords(
  number_of_words: number,
  interests: string[],
  difficulty: string,
  learnedWords: string[]
) {
  const prompt = `
      Generate EXACTLY ${number_of_words} words (no more, no less) with meaning and examples of sentences based on the user's interests and difficulty level among easy, medium, hard. Also give a prompt for that word that can be generate an image and avoid using words already learned by the user.
      Follow these rules:
      1. Generate EXACTLY ${number_of_words} words - this is a strict requirement.
      2. Use the user's interests: ${interests.join(", ")}.
      3. Use the user's difficulty level: ${difficulty}.
      4. Avoid using words already learned by the user: ${learnedWords.join(
        ", "
      )}.
      5. Ensure the words are unique.
      6. There EXACTLY 3 example sentences for each word.
      `;
  try {
    const result = await generateObject({
      model: groq("llama-3.3-70b-versatile"),
      system: "You are a strict JSON generator.",
      prompt: prompt,
      schema: z.object({
        choice: z.array(
          z.object({
            word: z.string().describe("The word to be learned"),
            meaning: z.string().describe("The meaning of the word"),
            exampleSentences: z.array(z.string().describe("Example sentences")),
            category: z.string().describe("The category of the word"),
            prompt: z.string().describe("The prompt for generating an image"),
          })
        ),
      }),
    });
    return result.object.choice;
  } catch (error) {
    console.error("Error generating words:", error);
    throw new Error("Failed to generate words");
  }
}
export async function getGroqInterests(interestes: string) {
  const result = await generateObject({
    model: groq("gemma2-9b-it"),
    system: "You are a strict JSON generator.",
    prompt: `Extract interests from the user's input. The user is interested in ${interestes}.`,
    schema: z.object({
      choice: z.array(z.string().describe("Interests")),
    }),
  });
  return result.object.choice;
}

export async function getGroqQuiz(
  words: string[],
  difficulty: string,
  quizDuration: number,
  learningLanguage: string
) {
  const QuestionType = ["MULTIPLE_CHOICE", "TRUE_FALSE", "FILL_IN_THE_BLANK"];

  const prompt = `
  {
    "questions": [
      {
        "questionType": "${QuestionType.join("|")}",
        "questionText": "string",
        "options": ["string"], // Required for MULTIPLE_CHOICE types
        "correctAnswer": "string",
        "explanation": "string",
        "points": number
      }
    ]
  }
  Generate a quiz strictly following this JSON schema. Use these words: ${words.join(
    ", "
  )}.

  Requirements:
  1. Difficulty: ${difficulty} (translate to appropriate question complexity)
  2. Question types: ${QuestionType.join(", ")} - must match exactly
  3. For MULTIPLE_CHOICE: 1 correct and other options incorrect
  4. Points: 1 for basic, 2-3 for complex questions
  5. Every field must be filled
  6. Output pure JSON with no formatting or explanations
  7. Question text must be in ${learningLanguage}
  8. True/False questions solutions must be in 1 for true and 0 for false

  Generate exactly ${Math.floor(quizDuration * 1.5)} questions in JSON format. 
  `;
  try {
    const result = await generateObject({
      model: groq("llama-3.3-70b-versatile"),
      system: "You are a strict JSON generator.",
      prompt: prompt,
      schema: z.object({
        questions: z.array(
          z.object({
            questionType: z
              .string()
              .describe(
                `The type of question amoung ${QuestionType.join(", ")}`
              ),
            questionText: z.string().describe("The question text"),
            options: z.array(
              z
                .string()
                .describe("For MULTIPLE_CHOICE: 4 options, 1 correct")
                .optional()
            ),
            correctAnswer: z.string().describe("The correct answer"),
            explanation: z.string().describe("Explanation for the answer"),
            points: z
              .number()
              .describe(
                "Points for the question.1 for basic, 2-3 for complex questions"
              ),
          })
        ),
      }),
    });
    return result.object;
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("Failed to generate quiz");
  }
}
