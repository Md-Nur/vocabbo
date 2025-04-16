"use client";
import Loading from "@/components/Loading";
import Title from "@/components/Title";
import { useAppSelector } from "@/store/hooks";
import { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";

const Leaderboard = () => {
  const { user: myUser } = useAppSelector((state) => state.user);
  const {
    data: leaderboard,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const res = await axios.get("/api/leaderboard");
      return res.data;
    },
  });
  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Error</h1>
        <p>
          {isAxiosError(error) ? error.response?.data.message : error.message}
        </p>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center max-h-screen my-10">
      <Title>Leaderboard</Title>
      <div className="overflow-x-auto w-screen max-w-6xl mx-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Email</th>
              <th>Language</th>
              <th>Difficulty</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map(
              (
                user: {
                  id: string;
                  user: User;
                  totalScore: number;
                },
                i: number
              ) => (
                <tr
                  key={user.id}
                  className={`${
                    user.user.id === myUser?.id ? "bg-neutral text-neutral-content" : ""
                  }`}
                >
                  <th>{i + 1}</th>
                  <td>{user.user.name}</td>
                  <td>{user.user.email}</td>
                  <td>{user.user.learningLanguage}</td>
                  <td className="capitalize">
                    {user.user.difficulty}
                  </td>
                  <td>{user.totalScore}</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
