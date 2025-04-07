"use client";
import { useAppSelector } from "@/store/hooks";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Words from "@/components/Words";
import Loading from "@/components/Loading";

const MyWords = () => {
  const user = useAppSelector((state) => state.user.user);
  const { data: words, isLoading } = useQuery({
    queryKey: ["my-words"],
    queryFn: async () => {
      const response = await axios.get("/api/user/" + user?.id);
      return response.data;
    },
  });
  if (isLoading) return <Loading />;
  return <Words words={words} />;
};

export default MyWords;
