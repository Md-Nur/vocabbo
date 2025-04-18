"use client";
import { useAppSelector } from "@/store/hooks";
import { EnglishWord, TranslateWord, UserWord, Word } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { IoBookmarkSharp } from "react-icons/io5";
import { toast } from "sonner";
import Title from "../Title";

export interface detailsWord extends Word {
  interactions: UserWord[];
  translateWord: TranslateWord[];
  englishWord: EnglishWord;
}

const SingleWord = ({ word, title }: { word: detailsWord; title?: string }) => {
  const { user } = useAppSelector((state) => state.user);
  const [isBookmarked, setIsBookmarked] = useState<Boolean>(
    word?.interactions.length ? word?.interactions[0]?.isBookmarked : false
  );
  useEffect(() => {
    setIsBookmarked(
      word?.interactions.length ? word?.interactions[0]?.isBookmarked : false
    );
  }, [word]);

  const { mutate: handleBookmark } = useMutation({
    mutationKey: ["bookmark-word", word.id],
    mutationFn: async () => {
      if (!user?.id) {
        toast.error("Please login to bookmark a word");
        return;
      }
      setIsBookmarked(!isBookmarked);
      const res = await axios.put(`/api/words/word/${word.id}/bookmark`, {
        userId: user?.id,
        isBookmarked: !isBookmarked,
      });
      setIsBookmarked(res.data.isBookmarked);
    },
    onError: (error) => {
      console.error(error);
      toast.error(
        isAxiosError(error)
          ? error?.response?.data?.error
          : "Something went wrong"
      );
    },
  });

  return (
    <div className="my-10 w-full">
      <Title>{title}</Title>
      <div className="hero-content flex-col lg:flex-row">
        {word.imageUrl && (
          <Image
            width={1024}
            height={1024}
            src={word.imageUrl}
            alt={word.word}
            className="max-w-sm rounded-lg shadow-2xl"
            placeholder="blur"
            blurDataURL="/blurImg.png"
          />
        )}
        <div>
          <div className="flex w-full gap-5 items-center flex-wrap">
            <h1 className="text-3xl font-bold">{word?.word}</h1>
            {word?.translateWord[0] && (
              <p className="badge badge-primary">
                {word.translateWord[0].wordLanguage}
              </p>
            )}
            <p className="badge badge-neutral">{word.category}</p>
            <div className="tooltip">
              <IoBookmarkSharp
                className={`text-2xl cursor-pointer ${
                  isBookmarked ? "text-info" : "text-base-content"
                }`}
                onClick={() => handleBookmark()}
              />
              <div className="tooltip-content">
                <div className="animate-bounce">
                  {isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
                </div>
              </div>
            </div>
          </div>

          <p className="py-6">{word.meaning}</p>
          <ul className="list-disc list-inside">
            {word.exampleSentences.map((example: string, index: number) => (
              <li key={index}>{example}</li>
            ))}
          </ul>
          <div className="flex gap-2 items-center flex-wrap"></div>
          {word?.translateWord[0] && (
            <>
              <hr className="my-4" />
              <div className="flex gap-2 items-center flex-wrap">
                <h1 className="text-3xl font-bold">
                  {word.translateWord[0]?.translatedWord}
                </h1>
                <p className="badge badge-primary">
                  {word.translateWord[0]?.translatedWordLanguage}
                </p>
                {word.translateWord[0]?.translatedCategory && (
                  <p className="badge badge-neutral">
                    {word.translateWord[0]?.translatedCategory}
                  </p>
                )}
              </div>
              <p className="py-6">{word.translateWord[0]?.translatedMeaning}</p>
              <ul className="list-disc list-inside">
                {word.translateWord[0]?.translatedExampleSentences.map(
                  (example: string, index: number) => (
                    <li key={index}>{example}</li>
                  )
                )}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleWord;
