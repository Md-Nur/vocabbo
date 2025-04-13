"use client";
import { useQuery } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";
import Loading from "@/components/Loading";
import { useAppSelector } from "@/store/hooks";
import { QuizAttempt, Quiz } from "@prisma/client";
import Link from "next/link";
import TableLink from "@/components/TableLink";

type QuizResult = QuizAttempt & {
  quiz: Quiz;
};

const QuizResults = () => {
  const user = useAppSelector((state) => state.user.user);
  const {
    data: quizResults,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["quizResults"],
    queryFn: async () => {
      const response = await axios.post("/api/quizzes/results", {
        userId: user?.id,
      });
      return response.data;
    },
  });
  if (isLoading) {
    return <Loading />;
  } else if (isError) {
    return (
      <div className="p-4 text-center text-error my-10">
        <h1 className="text-2xl font-bold mb-4">Quiz Results</h1>
        {isAxiosError(error) ? error.response?.data.error : error.message}
      </div>
    );
  }
  console.log(quizResults);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-center my-10">
        Quiz Results
      </h1>
      <div className="overflow-x-auto max-w-5xl mx-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>Start At</th>
              <th>Completed At</th>
              <th>Duration</th>
              <th>Score</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {quizResults.map((result: QuizResult) => (
              <tr key={result.id} className="hover:bg-base-300">
                <TableLink to={`/quiz-results/${result.quiz.id}`}>
                  {new Date(result.startedAt).toLocaleString("en-IN")}
                </TableLink>
                <TableLink to={`/quiz-results/${result.quiz.id}`}>
                  {result.completedAt
                    ? new Date(result.completedAt).toLocaleString("en-IN")
                    : "Not completed"}
                </TableLink>
                <TableLink to={`/quiz-results/${result.quiz.id}`}>
                  {result.quiz.duration} min
                </TableLink>
                <TableLink to={`/quiz-results/${result.quiz.id}`}>
                  {result.score}/{result.totalScore}
                </TableLink>
                <TableLink
                  to={`/quiz-results/${result.quiz.id}`}
                  className="capitalize"
                >
                  {result.status.toLowerCase()}
                </TableLink>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuizResults;
