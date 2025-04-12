"use client";
import Loading from "@/components/Loading";
import Words from "@/components/Words";
import { useAppSelector } from "@/store/hooks";
import { Word } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const NewWords = () => {
  const user = useAppSelector((state) => state.user.user);
  const [number_of_words, setNumberOfWords] = useState(5);
  const [words, setWords] = useState<Word[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const newWords = useMutation({
    mutationFn: async (learnedWords: string[]) => {
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
        setIsLoading(false);
      });
    },

    onError: (error) => {
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
        user,
        number_of_words,
      });
      return response.data;
    },
  });

  console.log(learnWords.data);
  useEffect(() => {
    if (learnWords.isLoading) {
      setIsLoading(true);
    } else if (learnWords.isSuccess) {
      if (learnWords.data.isAvailable) {
        newWords.mutate(learnWords.data.words);
      } else {
        toast.error("You have already learned today's words");
        redirect("/my-words/1");
      }
    } else if (learnWords.isError) {
      if (isAxiosError(learnWords.error)) {
        toast.error(learnWords.error?.response?.data?.error);
      } else {
        toast.error("Something went wrong");
      }
      redirect("/my-words/1");
    }
  }, [
    learnWords.isSuccess,
    learnWords.isError,
    learnWords.data,
    learnWords.error,
  ]);

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
