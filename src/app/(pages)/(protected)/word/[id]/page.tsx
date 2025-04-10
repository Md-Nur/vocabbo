"use client";
import Loading from "@/components/Loading";
import { useAppSelector } from "@/store/hooks";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import { use, useEffect, useState } from "react";
import { IoBookmarkSharp } from "react-icons/io5";
import { toast } from "sonner";

const SingleWord = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const { user } = useAppSelector((state) => state.user);

  const {
    data: word,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["single-word", id],
    queryFn: async () => {
      const res = await axios.post(`/api/words/word/${id}`, user);
      return res.data;
    },
  });

  
  const [isBookmarked, setIsBookmarked] = useState<Boolean>(
    word?.interactions.length ? word?.interactions[0]?.isBookmarked : false
  );
  useEffect(() => {
    setIsBookmarked(
      word?.interactions.length ? word?.interactions[0]?.isBookmarked : false
    );
  }, [word]);

  if (isLoading) return <Loading />;
  else if (isError) {
    console.log(error);
    return (
      <div className="text-error text-center text-3xl my-10">
        {error instanceof AxiosError && error?.response?.data?.error
          ? error.response.data.error
          : "Something went wrong"}
      </div>
    );
  }

  const handleBookmark = async () => {
    if (!user?.id) {
      toast.error("Please login to bookmark a word");
      return;
    }
    setIsBookmarked(!isBookmarked);
    const res = await axios.put(`/api/words/word/${id}/bookmark`, {
      userId: user?.id,
      isBookmarked: !isBookmarked,
    });
    setIsBookmarked(res.data.isBookmarked);
  };
  return (
    <div className="hero min-h-screen">
      <div className="hero-content flex-col lg:flex-row">
        {word.imageUrl && (
          <Image
            width={1024}
            height={1024}
            src={word.imageUrl}
            alt={word.word}
            className="max-w-sm rounded-lg shadow-2xl"
          />
        )}
        <div>
          <div className="flex w-full gap-5 items-center">
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
                onClick={handleBookmark}
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
          <div className="flex gap-2 items-center"></div>
          {word?.translateWord[0] && (
            <>
              <hr className="my-4" />
              <div className="flex gap-2 items-center">
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
