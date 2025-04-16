"use client";
import Loading from "@/components/Loading";
import Words from "@/components/Words";
import { getPreviousRoute } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import { setLoading } from "@/store/slices/userSlice";
import { Word } from "@prisma/client";
import axios from "axios";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const NewWords = () => {
  const user = useAppSelector((state) => state.user.user);
  const [number_of_words, setNumberOfWords] = useState(50);
  const [words, setWords] = useState<Word[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchWords = async (learnWords: string[]) => {
    try {
      const response = await fetch("/api/words/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user,
          number_of_words,
          learnedWords: learnWords,
        }),
      });

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      setIsLoading(true);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter((line) => line.trim());

        for (const line of lines) {
          try {
            const word: Word = JSON.parse(line);
            setWords((prevWords) => [...prevWords, word]);
          } catch (e) {
            console.error("Error parsing word:", e);
          }
        }
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching words:", error);
      toast.error("Failed to fetch words");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    axios
      .post("/api/words/learn", {
        user,
        number_of_words,
      })
      .then((response) => {
        if (response.data.isAvailable) {
          fetchWords(response.data.words);
        } else {
          toast.error("You have to wait before learning new words.");
          router.push("/my-words/1");
        }
      })
      .catch((error) => {
        console.error("Error fetching learn words:", error);
        toast.error("Failed to fetch learn words");
        redirect(getPreviousRoute());
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Only show loading when there are no words and we're loading
  if (isLoading && words.length === 0) return <Loading />;

  return (
    <div className="">
      <h1 className="text-4xl font-bold my-6 text-center">New Words</h1>
      <Words words={words} />
    </div>
  );
};

export default NewWords;
