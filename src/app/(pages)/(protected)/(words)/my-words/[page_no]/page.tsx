"use client";
import { useAppSelector } from "@/store/hooks";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import Words from "@/components/Words/Words";
import Loading from "@/components/Loading";
import { useParams, useRouter } from "next/navigation";
import Pagination from "@/components/Pagination";
import { toast } from "sonner";
import ErrorPage from "@/components/ErrorPage";

const MyWords = () => {
  const params = useParams();
  const page_no = parseInt(params.page_no as string, 10) || 1;
  const user = useAppSelector((state) => state.user.user);
  const router = useRouter();
  const {
    data: words,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["my-words", page_no],
    queryFn: async () => {
      const response = await axios.get(`/api/user/${user?.id}?page=${page_no}`);
      return response.data;
    },
  });

  if (isLoading) return <Loading />;
  else if (isError) {
    return <ErrorPage title="My Words" error={error} />;
  } else if (page_no > words.totalPages) {
    toast.error("Page not found");
    router.push(`/my-words/${words.totalPages}`);
  } else if (page_no < 1) {
    toast.error("Page not found");
    router.push(`/my-words/1`);
  }
  return (
    <div className="w-full">
      <h1 className="text-2xl md:text-5xl font-bold text-center my-5 md:my-10">
        My Words
      </h1>

      <Words words={words.words} />
      <Pagination
        totalPages={words.totalPages}
        pageNo={page_no}
        path="/my-words"
      />
    </div>
  );
};

export default MyWords;
