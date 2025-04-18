"use client";
import Loading from "@/components/Loading";
import { detailsWord } from "@/components/Words/SingleWord";
import { useAppSelector } from "@/store/hooks";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError, isAxiosError } from "axios";
import { useParams } from "next/navigation";
import SingleWord from "@/components/Words/SingleWord";

const OneWord = () => {
  const { id } = useParams();
  const { user } = useAppSelector((state) => state.user);

  const {
    data: word,
    isLoading,
    isError,
    error,
  } = useQuery<detailsWord, AxiosError>({
    queryKey: ["single-word", id],
    queryFn: async () => {
      const res = await axios.post(`/api/words/word/${id}`, user);
      return res.data;
    },
  });

  if (isLoading) return <Loading />;
  else if (isError || !word) {
    console.error(error);
    return (
      <div className="text-error text-center text-3xl my-10">
        {isAxiosError(error)
          ? (error?.response?.data as { error: string })?.error
          : "Something went wrong"}
      </div>
    );
  }
  return <SingleWord word={word} />;
};

export default OneWord;
