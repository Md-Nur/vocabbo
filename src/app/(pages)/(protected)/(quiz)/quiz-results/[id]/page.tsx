"use client";
import Loading from "@/components/Loading";
import Title from "@/components/Title";
import { Quiz, QuizAttempt, QuizQuestion, QuizResult } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { IoCheckmark, IoWarning } from "react-icons/io5";

interface QuizResultDetails extends QuizQuestion {
  QuizResult: QuizResult[];
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
    <div className="w-full my-10">
      <Title>Quiz Result</Title>
      <div className="space-y-4">
        <div className="space-y-2 flex flex-col justify-center items-center">
          <div className="flex gap-5">
            <span className="">Score: {quizResult?.attempts[0]?.score}</span>
            <span className="">Total Score: {quizResult?.attempts[0]?.totalScore}</span>
          </div>
          <p>
            Completed At:&nbsp;
            {quizResult?.attempts[0]?.completedAt
              ? new Date(quizResult.attempts[0].completedAt).toLocaleString(
                  "en-IN"
                )
              : "N/A"}
          </p>
          <p>
            Time:&nbsp;
            {quizResult?.duration ? `${quizResult.duration} minutes` : "N/A"}
          </p>
        </div>

        {quizResult?.questions && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-3 text-center">
              Questions and Answers
            </h2>
            <div className="space-y-4">
              {quizResult?.questions.map((question) => (
                <div
                  key={question.id}
                  className="m-3 p-3 md:m-6 md:p-6 bg-neutral text-neutral-content rounded-xl space-y-5"
                >
                  <p className="w-full flex justify-between">
                    <span>Question: {question.questionText}</span>
                    <span
                      className={`text-right btn btn-sm mx-2 border-none ${
                        question.QuizResult[0].isCorrect
                          ? "btn-success"
                          : !question.QuizResult[0]?.userAnswer
                          ? "btn-warning"
                          : "btn-error"
                      }`}
                    >
                      {question?.points}
                    </span>
                  </p>
                  <p>Explanation: {question.explanation}</p>
                  <p className="w-full flex gap-5 items-center justify-between">
                    <span>
                      Correct Answer:&nbsp;
                      {question.questionType === "TRUE_FALSE"
                        ? question.correctAnswer === "T"
                          ? "True"
                          : "False"
                        : question.correctAnswer}
                    </span>
                    {question.QuizResult[0]?.userAnswer ? (
                      <span>
                        User Answer:&nbsp;
                        {question.questionType === "TRUE_FALSE"
                          ? question.QuizResult[0].userAnswer === "T"
                            ? "True"
                            : "False"
                          : question.QuizResult[0].userAnswer}
                      </span>
                    ) : null}
                    <span>
                      {question.QuizResult[0]?.isCorrect ? (
                        <span className="flex items-center gap-2 badge badge-success border-none">
                          Correct
                          <FaCheck />
                        </span>
                      ) : question.QuizResult[0]?.userAnswer ? (
                        <span className="flex items-center gap-2 badge badge-error border-none">
                          Incorrect
                          <FaTimes />
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 badge badge-warning border-none">
                          Did not attempt
                          <IoWarning />
                        </span>
                      )}
                    </span>
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
