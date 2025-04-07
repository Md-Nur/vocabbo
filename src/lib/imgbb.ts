import axios from "axios";
// import { blackforest } from "./blackforest";
import { dalle } from "./dalle";

export async function imgbb(word: {
  word: string;
  prompt: string;
  category: string;
  meaning: string;
}) {
  if (!process.env.NEXT_PUBLIC_IMGBB_API_KEY) {
    throw new Error("NEXT_PUBLIC_IMGBB_API_KEY is not defined");
  }
  if (!word) {
    throw new Error("Word is not defined");
  }
  const prompt = `Generate an image of ${word.word} in the category of ${word.category} with the meaning of ${word.meaning}. The image should be a ${word.prompt}.`;

  try {
    const file = await dalle(prompt);
    const buffer = file?.base64;
    if (!buffer) {
      throw new Error("Buffer is not defined");
    }
    const formData = new FormData();
    formData.append("image", buffer);
    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
      formData
    );
    const imageUrl = response.data.data.display_url;
    return imageUrl;
  } catch (error) {
    console.error("Error uploading image to imgbb:", error);
    return null;
  }
}
