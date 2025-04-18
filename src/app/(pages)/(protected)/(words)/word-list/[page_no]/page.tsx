"use client";
import { useAppSelector } from "@/store/hooks";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import Words from "@/components/Words/Words";
import Loading from "@/components/Loading";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Pagination from "@/components/Pagination";
import { toast } from "sonner";
import Search from "@/components/Search";
import Filter from "@/components/Filter";

const AllWords = () => {
  const params = useParams();
  const page_no = parseInt(params.page_no as string, 10) || 1;
  const searchParams = useSearchParams();
  const search =
    searchParams.get("search")?.toLowerCase().trim().replace(/ /g, "-") || "";
  const filter =
    searchParams.get("filter")?.toLowerCase().trim().replace(/ /g, "-") || "";
  const router = useRouter();
  const {
    data: words,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["word-list", page_no, search, filter],
    queryFn: async () => {
      const response = await axios.get(
        `/api/words?page=${page_no}&search=${search}&filter=${filter}`
      );
      return response.data;
    },
  });

  if (isLoading) return <Loading />;
  else if (isError) {
    return (
      <div className="w-full">
        <h1 className="text-2xl md:text-5xl font-bold text-center my-5 md:my-10">
          Word List
        </h1>
        <Search />
        <div className="text-center text-red-500 my-10 text-2xl">
          {error instanceof AxiosError && error.response?.data?.error
            ? error.response.data.error
            : "Something went wrong"}
        </div>
      </div>
    );
  } else if (page_no > words.totalPages) {
    toast.error("Page not found");
    router.push(`/word-list/${words.totalPages}`);
  } else if (page_no < 1) {
    toast.error("Page not found");
    router.push(`/word-list/1`);
  }
  return (
    <div className="w-full">
      <h1 className="text-2xl md:text-5xl font-bold text-center my-5 md:my-10">
        Word List
      </h1>
      <Search />
      <Filter options={words.filterOptions} />
      <Words words={words.words} />
      <Pagination
        totalPages={words.totalPages}
        pageNo={page_no}
        path="/word-list"
      />
    </div>
  );
};

export default AllWords;
