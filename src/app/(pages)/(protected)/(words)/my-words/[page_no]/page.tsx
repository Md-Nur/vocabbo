"use client";
import { useAppSelector } from "@/store/hooks";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Words from "@/components/Words";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";
import { use } from "react";
import Pagination from "@/components/Pagination";
import { toast } from "sonner";

const MyWords = ({ params }: { params: Promise<{ page_no: number }> }) => {
  const resolvedParams: { page_no: number } = use(params);
  const user = useAppSelector((state) => state.user.user);
  const router = useRouter();
  const { data: words, isLoading } = useQuery({
    queryKey: ["my-words", resolvedParams.page_no],
    queryFn: async () => {
      const response = await axios.get(
        `/api/user/${user?.id}?page=${resolvedParams.page_no}`
      );
      return response.data;
    },
  });
  

  if (isLoading) return <Loading />;
  else if (resolvedParams.page_no > words.totalPages) {
    toast.error("Page not found");
    router.push(`/my-words/${words.totalPages}`);
  } else if (resolvedParams.page_no < 1) {
    toast.error("Page not found");
    router.push(`/my-words/1`);
  }
  return (
    <div className="w-full">
      <h1 className="text-2xl md:text-5xl font-bold text-center my-5 md:my-10">My Words</h1>

      <Words words={words.words} />
      {words.totalPages > 1 && (
        <Pagination
          totalPages={words.totalPages}
          pageNo={resolvedParams.page_no}
          path="/my-words"
        />
      )}
    </div>
  );
};

export default MyWords;
