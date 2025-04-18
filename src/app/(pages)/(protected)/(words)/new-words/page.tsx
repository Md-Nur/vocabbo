"use client";
import ErrorPage from "@/components/ErrorPage";
import Loading from "@/components/Loading";
import Title from "@/components/Title";
import SingleWord, { detailsWord } from "@/components/Words/SingleWord";
import errorHandler from "@/lib/errorHandler";
import { getPreviousRoute } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const WordNo = () => {
  const [word_no, setWordNo] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AxiosError | null>(null);
  const router = useRouter();
  const [words, setWords] = useState<detailsWord[] | null>(null);
  const [learnedWords, setLearnedWords] = useState<string[] | null>(null);
  const [fetchNumber, setFetchNumber] = useState<number>(0);
  const { user } = useAppSelector((state) => state.user);

  const fetchNewWord = async () => {
    if (!learnedWords || !user) {
      return;
    }
    setFetchNumber((prev) => prev + 1);
    if (fetchNumber >= Number(process.env.NEXT_PUBLIC_NUMBER_OF_WORDS)) {
      return;
    }
    try {
      const { data } = await axios.post("/api/words/single-new", {
        user,
        learnedWords,
      });

      setLearnedWords((prev) => {
        if (prev) {
          return [data.englishWord.englishWord, ...prev];
        }
        return [data.englishWord.englishWord];
      });
      setWords((prev) => {
        if (prev) {
          return [...prev, data];
        }
        return [data];
      });
    } catch (error) {
      setFetchNumber((prev) => prev - 1);
      console.error("Error fetching new word:", error);
    }
  };

  useEffect(() => {
    const fetchLearnWords = async () => {
      setLoading(true);

      try {
        const res = await axios.post("/api/words/learn", {
          user,
          number_of_words: process.env.NEXT_PUBLIC_NUMBER_OF_WORDS || 10,
        });
        if (res.data.isAvailable) {
          setLearnedWords(res.data.words);
        } else {
          toast.error("No more words available");
          router.push(getPreviousRoute());
        }
      } catch (error) {
        setError(error as AxiosError);
        toast.error("Error fetching words");
        console.error("Error fetching words:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLearnWords();
  }, [user]);

  useEffect(() => {
    if (
      loading ||
      (words && words?.length > Number(process.env.NEXT_PUBLIC_NUMBER_OF_WORDS))
    )
      return;
    else if (
      word_no < 1 ||
      word_no > Number(process.env.NEXT_PUBLIC_NUMBER_OF_WORDS)
    ) {
      toast.error("Invalid Word Number");
      router.push(getPreviousRoute());
    } else if (
      (words &&
        fetchNumber < Number(process.env.NEXT_PUBLIC_NUMBER_OF_WORDS) &&
        fetchNumber - 3 < word_no) ||
      !words
    ) {
      fetchNewWord();
    }
  }, [word_no, learnedWords]);

  if (!words || learnedWords === null) {
    return <Loading />;
  }

  if (error) return <ErrorPage title="New Words" error={error} />;

  if (words.length < word_no) {
    return <Loading />;
  }
  if (!words[word_no - 1] || !words[word_no - 1].word) {
    return <div className="text-center my-20 text-error">Word not found</div>;
  }

  return (
    <div className="flex flex-col my-5 mx-2 items-center justify-center">
      <SingleWord title={`Word ${word_no}`} word={words[word_no - 1]} />
      <div className="join">
        {!(word_no === 1) && (
          <button
            onClick={() => {
              setWordNo((prev) => prev - 1);
            }}
            className="join-item btn"
          >
            « Previous Word
          </button>
        )}
        {!(word_no === Number(process.env.NEXT_PUBLIC_NUMBER_OF_WORDS)) && (
          <button
            onClick={() => {
              setWordNo((prev) => prev + 1);
            }}
            className="join-item btn"
          >
            Next Word »
          </button>
        )}
      </div>
    </div>
  );
};

export default WordNo;
