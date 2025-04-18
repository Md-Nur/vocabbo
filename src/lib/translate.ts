import axios from "axios";
import errorHandler from "./errorHandler";
import { generateObject } from "ai";
import { groq } from "@ai-sdk/groq";
import { z } from "zod";

const headers = {
  "x-rapidapi-key": process.env.RAPID_API_KEY,
  "x-rapidapi-host": "translateai.p.rapidapi.com",
};
const baseUrl = "https://translateai.p.rapidapi.com";

export const languages = {
  Afrikaans: "af",
  Albanian: "sq",
  Amharic: "am",
  Arabic: "ar",
  Armenian: "hy",
  Assamese: "as",
  Aymara: "ay",
  Azerbaijani: "az",
  Bambara: "bm",
  Basque: "eu",
  Belarusian: "be",
  Bengali: "bn",
  Bhojpuri: "bho",
  Bosnian: "bs",
  Bulgarian: "bg",
  Catalan: "ca",
  Cebuano: "ceb",
  Chinese_Simplified: "zh-CN",
  Chinese_Traditional: "zh-TW",
  Corsican: "co",
  Croatian: "hr",
  Czech: "cs",
  Danish: "da",
  Dhivehi: "dv",
  Dogri: "doi",
  Dutch: "nl",
  English: "en",
  Esperanto: "eo",
  Estonian: "et",
  Ewe: "ee",
  Filipino_Tagalog: "fil",
  Finnish: "fi",
  French: "fr",
  Frisian: "fy",
  Galician: "gl",
  Georgian: "ka",
  German: "de",
  Greek: "el",
  Guarani: "gn",
  Gujarati: "gu",
  Haitian_Creole: "ht",
  Hausa: "ha",
  Hawaiian: "haw",
  Hebrew: "he",
  Hindi: "hi",
  Hmong: "hmn",
  Hungarian: "hu",
  Icelandic: "is",
  Igbo: "ig",
  Ilocano: "ilo",
  Indonesian: "id",
  Irish: "ga",
  Italian: "it",
  Japanese: "ja",
  Javanese: "jv",
  Kannada: "kn",
  Kazakh: "kk",
  Khmer: "km",
  Kinyarwanda: "rw",
  Konkani: "gom",
  Korean: "ko",
  Krio: "kri",
  Kurdish: "ku",
  Kurdish_Sorani: "ckb",
  Kyrgyz: "ky",
  Lao: "lo",
  Latin: "la",
  Latvian: "lv",
  Lingala: "ln",
  Lithuanian: "lt",
  Luganda: "lg",
  Luxembourgish: "lb",
  Macedonian: "mk",
  Maithili: "mai",
  Malagasy: "mg",
  Malay: "ms",
  Malayalam: "ml",
  Maltese: "mt",
  Maori: "mi",
  Marathi: "mr",
  Meiteilon_Manipuri: "mni-Mtei",
  Mizo: "lus",
  Mongolian: "mn",
  Myanmar_Burmese: "my",
  Nepali: "ne",
  Norwegian: "no",
  Nyanja_Chichewa: "ny",
  Odia_Oriya: "or",
  Oromo: "om",
  Pashto: "ps",
  Persian: "fa",
  Polish: "pl",
  Portuguese_Portugal: "pt",
  Portuguese_Brazil: "pt",
  Punjabi: "pa",
  Quechua: "qu",
  Romanian: "ro",
  Russian: "ru",
  Samoan: "sm",
  Sanskrit: "sa",
  Scots_Gaelic: "gd",
  Sepedi: "nso",
  Serbian: "sr",
  Sesotho: "st",
  Shona: "sn",
  Sindhi: "sd",
  Sinhala_Sinhalese: "si",
  Slovak: "sk",
  Slovenian: "sl",
  Somali: "so",
  Spanish: "es",
  Sundanese: "su",
  Swahili: "sw",
  Swedish: "sv",
  Tagalog_Filipino: "tl",
  Tajik: "tg",
  Tamil: "ta",
  Tatar: "tt",
  Telugu: "te",
  Thai: "th",
  Tigrinya: "ti",
  Tsonga: "ts",
  Turkish: "tr",
  Turkmen: "tk",
  Twi_Akan: "ak",
  Ukrainian: "uk",
  Urdu: "ur",
  Uyghur: "ug",
  Uzbek: "uz",
  Vietnamese: "vi",
  Welsh: "cy",
  Xhosa: "xh",
  Yiddish: "yi",
  Yoruba: "yo",
  Zulu: "zu",
};

const detectLanguage = async (text: string) => {
  const res = await errorHandler(
    axios.post(
      `${baseUrl}/detect`,
      {
        input_text: text,
      },
      { headers }
    )
  );
  return res.data?.lang;
};
export const getTranslateWords2 = async (
  content: {
    word: string;
    meaning: string;
    category: string;
    exampleSentences: string[];
  },
  targetLanguage: string,
  originLanguage: string = "English"
) => {
  // const originLanguage = await errorHandler(detectLanguage(content.word));
  const res = await errorHandler(
    axios.post(
      `${baseUrl}/google/translate/json`,
      {
        origin_language: languages[originLanguage as keyof typeof languages],
        target_language: languages[targetLanguage as keyof typeof languages],
        words_not_to_translate: ".End_Of_Sentence.",
        json_content: {
          word: content.word,
          meaning: content.meaning,
          e0: content.exampleSentences[0],
          e1: content.exampleSentences[1],
          e2: content.exampleSentences[2],
          category: content.category,
        },
      },
      {
        headers,
      }
    )
  );
  return {
    word: res.data.translated_json.word,
    meaning: res.data.translated_json.meaning,
    exampleSentences: [
      res.data.translated_json.e0,
      res.data.translated_json.e1,
      res.data.translated_json.e2,
    ],
    category: res.data.translated_json.category,
  };
};
export const getTranslateWords = async (
  content: {
    word: string;
    meaning: string;
    category: string;
    exampleSentences: string[];
  },
  targetLanguage: string,
  originLanguage: string = "English"
) => {
  const prompt = `You are a multilingual assistant. Your task is to translate specific English text fragments into a given target language and output ONLY the translations in the following JSON format.

Target Language
${targetLanguage}

Input
- English Word: ${content.word}
- Meaning: ${content.meaning}
- Example Sentence 1: ${content.exampleSentences[0]}
- Example Sentence 2: ${content.exampleSentences[1]}
- Example Sentence 3: ${content.exampleSentences[2]}
- Category: ${content.category}

Output
Translate the above content into the target language (${targetLanguage}), and provide a valid JSON object in the schema below.

JSON Schema:
{
  "word": "string",
  "meaning": "string",
  "exampleSentences": ["string", "string", "string"],
  "category": "string"
}`;
  const result = await generateObject({
    model: groq("gemma2-9b-it"),
    system: "You are a strict JSON generator that translate text.",
    prompt: prompt,
    schema: z.object({
      word: z.string().describe("Word"),
      meaning: z.string().describe("Meaning"),
      exampleSentences: z.array(z.string().describe("Example Sentences")),
      category: z.string().describe("Category"),
    }),
  });
  return result.object;
};
