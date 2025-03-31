import { openai } from "@ai-sdk/openai";
import { experimental_generateImage } from "ai";

export async function dalle(prompt: string) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not defined");
  }
  try {
    const { image } = await experimental_generateImage({
      model: openai.image("dall-e-3"),
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });
    return image;
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image");
  }
}
