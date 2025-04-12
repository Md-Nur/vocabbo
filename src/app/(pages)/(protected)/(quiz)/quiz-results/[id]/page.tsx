"use client";
import Loading from "@/components/Loading";
import { Quiz, QuizAttempt, QuizQuestion, QuizResult } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface QuizResultDetails extends QuizQuestion {
  QuizResult: QuizResult;
}
interface QuizResultDetails extends Quiz {
  questions: QuizResultDetails[];
  attempts: QuizAttempt[];
}

const SingleQuizResult = () => {
  const { id } = useParams();
  const [quizResult, setQuizResult] = useState<QuizResultDetails | null>(null);

  const {
    mutate: getQuizResult,
    isPending: isQuizResultLoading,
    isError,
    error,
  } = useMutation({
    mutationFn: async () => {
      const response = await axios.get(`/api/quizzes/results/${id}`);
      setQuizResult(response.data);
      return response.data;
    },
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  useEffect(() => {
    // Get data from localStorage
    const storedData = localStorage.getItem(`quiz_${id}`);
    if (storedData) {
      setQuizResult(JSON.parse(storedData));
      // Clean up the stored data
      localStorage.removeItem(`quiz_${id}`);
    } else {
      getQuizResult();
    }
  }, [id]);

  if (isQuizResultLoading && !quizResult) {
    return <Loading />;
  } else if (isError) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Quiz Result</h1>
        <p>Error fetching quiz result</p>
        <p>
          {isAxiosError(error) ? error.response?.data.error : error.message}
        </p>
      </div>
    );
  }
  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-4">Quiz Result</h1>
      <div className="space-y-4">
        <div className="space-y-2">
          <p>Quiz ID: {id}</p>
          <p>Score: {quizResult?.attempts[0]?.score}</p>
          <p>Total Score: {quizResult?.attempts[0]?.totalScore}</p>
          <p>
            Completed at:{" "}
            {quizResult?.attempts[0]?.completedAt
              ? new Date(quizResult.attempts[0].completedAt).toLocaleString()
              : "N/A"}
          </p>
          <p>
            Time taken:
            {quizResult?.duration ? `${quizResult.duration} minutes` : "N/A"}
          </p>
        </div>

        {quizResult?.questions && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-3">
              Questions and Answers
            </h2>
            <div className="space-y-4">
              {quizResult?.questions.map((question) => (
                <div key={question.id}>
                  <p>Question: {question.questionText}</p>
                  <p>Correct Answer: {question.correctAnswer}</p>
                  <p>Explanation: {question.explanation}</p>
                  {question.QuizResult?.userAnswer ? (
                    <p>User Answer: {question.QuizResult.userAnswer}</p>
                  ) : (
                    <p>Did not attempt</p>
                  )}
                  <p>
                    Status:{" "}
                    {question.QuizResult.isCorrect ? "Correct" : "Incorrect"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleQuizResult;
