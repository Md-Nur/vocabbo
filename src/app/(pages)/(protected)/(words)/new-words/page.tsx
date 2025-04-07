"use client";
import Loading from "@/components/Loading";
import Words from "@/components/Words";
import { useAppSelector } from "@/store/hooks";
import { Word } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const NewWords = () => {
  const user = useAppSelector((state) => state.user.user);
  const [number_of_words, setNumberOfWords] = useState(5);
  const [words, setWords] = useState<Word[]>([]);
  const [processedIds] = useState(new Set<string>());
  const [learnedWords, setLearnedWords] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const newWords = useMutation({
    mutationFn: async () => {
      const response = await axios.post(
        "/api/words/new",
        {
          user: user,
          number_of_words,
          learnedWords,
        },
        {
          responseType: "text",
        }
      );

      return new Promise<Word[]>((resolve, reject) => {
        const words: Word[] = [];
        const lines = response.data
          .split("\n")
          .filter((line: string) => line.trim());

        lines.forEach((line: string) => {
          try {
            const word = JSON.parse(line);
            words.push(word);
            setWords((prevWords) => [...prevWords, word]);
          } catch (e) {
            console.error("Error parsing word:", e);
          }
        });

        resolve(words);
      });
    },

    onError: (error) => {
      console.log(error);
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.error);
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  const learnWords = useQuery({
    queryKey: ["learn-words"],
    queryFn: async () => {
      const response = await axios.post("/api/words/learn", {
        user: user,
        number_of_words,
      });
      return response.data;
    },
  });

  useEffect(() => {
    if (learnWords.isSuccess) {
      setLearnedWords(learnWords.data);
      newWords.mutate();
    }
    if (learnWords.isError) {
      if (isAxiosError(learnWords.error)) {
        toast.error(learnWords.error?.response?.data?.error);
      } else {
        toast.error("Something went wrong");
      }
      redirect("/my-words");
    }
  }, [
    learnWords.isSuccess,
    learnWords.isError,
    learnWords.data,
    learnWords.error,
  ]);

  // Only show loading when there are no words and we're loading
  if (isLoading && words.length === 0) return <Loading />;
  // console.log(words[0][0].word);

  return (
    <div className="">
      <h1 className="text-4xl font-bold my-6 text-center">New Words</h1>
      <Words words={words} />
    </div>
  );
};

export default NewWords;
