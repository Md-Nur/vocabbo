"use client";
import Loading from "@/components/Loading";
import { useAppSelector } from "@/store/hooks";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import Timer from "@/components/Timer";
import DurationModal from "@/components/DurationModal";
import { useRef } from "react";

const StartQuiz = () => {
  const user = useAppSelector((state) => state.user.user);
  const router = useRouter();
  const [duration, setDuration] = useState<number | null>(null);
  const modalRef = useRef<HTMLDialogElement>(null);

  const {
    mutate: startQuiz,
    isPending: isQuizLoading,
    data: quiz,
    isError: isQuizError,
    error: quizError,
  } = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/quizzes/start", {
        userId: user?.id,
        duration: duration,
        difficulty: user?.difficulty,
        learningLanguage: user?.learningLanguage,
      });
      return response.data;
    },
  });

  const {
    data: isQuizAvailable,
    isSuccess: isQuizAvailableSuccess,
    isLoading: isQuizAvailableLoading,
    isError: isQuizAvailableError,
    error: quizAvailableError,
  } = useQuery({
    queryKey: ["is-quiz-available"],
    queryFn: async () => {
      const response = await axios.post("/api/quizzes/is-quiz-available", {
        userId: user?.id,
      });
      return response.data;
    },
  });

  useEffect(() => {
    if (isQuizAvailableSuccess) {
      modalRef.current?.showModal();
      if (duration) {
        startQuiz();
      }
    }
  }, [isQuizAvailableSuccess, duration]);

  const {
    mutate: submitQuiz,
    isPending: isSubmitQuizLoading,

    isError: isSubmitQuizError,
    error: submitQuizError,
  } = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/quizzes/submission", quiz);
      return response.data;
    },
    onSuccess: (data) => {
      // Store the data in localStorage
      localStorage.setItem(`quiz_${data.id}`, JSON.stringify(data));
      // Navigate to results page
      router.push(`/quiz-results/${data.id}`);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const { mutate: abandonQuiz, isPending: isAbandonQuizLoading } = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/quizzes/abandon", quiz);
      return response.data;
    },
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const handleTimeUp = () => {
    submitQuiz();
  };

  if (
    isQuizLoading ||
    isQuizAvailableLoading ||
    isSubmitQuizLoading ||
    isAbandonQuizLoading
  ) {
    return <Loading />;
  } else if (isQuizError || isQuizAvailableError || isSubmitQuizError) {
    const error = isAxiosError(quizError)
      ? quizError
      : isAxiosError(quizAvailableError)
      ? quizAvailableError
      : isAxiosError(submitQuizError)
      ? submitQuizError
      : null;
    if (error) {
      return (
        <div className="text-center text-error text-2xl my-10">
          {error?.response?.data.error}
        </div>
      );
    }
  } else if (!quiz)
    return (
      <DurationModal
        modalRef={modalRef as React.RefObject<HTMLDialogElement>}
        setDuration={setDuration}
      />
    );
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto">
      {quiz?.quiz.duration && (
        <Timer initialTime={quiz.quiz.duration * 60} onTimeUp={handleTimeUp} />
      )}
      <h1 className="text-2xl font-bold my-10">
        Quiz &nbsp;
        <span className="text-sm text-gray-500">
          ({quiz?.quizQuestions.length} questions)
        </span>
      </h1>
      <div className="w-full">
        {quiz?.quizQuestions.map(
          (
            question: {
              id: string;
              questionText: string;
              questionType: string;
              options: string[];
              points: number;
            },
            i: number
          ) => (
            <div
              key={question.id}
              className="my-4 rounded-lg p-4 bg-neutral text-neutral-content"
            >
              <h2 className="flex items-center gap-2 justify-between">
                <span className="">
                  {i + 1}&nbsp;{question.questionText}
                </span>
                <span className="text-sm text-info">{question.points}</span>
              </h2>
              {question.questionType === "MULTIPLE_CHOICE" ? (
                <ul className="list-inside flex flex-wrap gap-5 w-full m-2">
                  {question.options.map((option, j) => (
                    <li key={j} className="min-w-fit">
                      <label className="flex items-center gap-2 w-full">
                        <input
                          type="radio"
                          name={question.id}
                          value={option}
                          onChange={(e) => {
                            quiz.quizQuestions[i].answer = e.target.value;
                          }}
                        />
                        {option}
                      </label>
                    </li>
                  ))}
                </ul>
              ) : question.questionType === "TRUE_FALSE" ? (
                <ul className="list-inside flex flex-wrap gap-5 w-full m-2">
                  <li className="min-w-fit">
                    <label className="flex items-center gap-2 w-full">
                      <input
                        type="radio"
                        name={question.id}
                        value="T"
                        onChange={(e) => {
                          quiz.quizQuestions[i].answer = e.target.value;
                        }}
                      />
                      True <FaCheck className="text-success" />
                    </label>
                  </li>
                  <li className="min-w-fit">
                    <label className="flex items-center gap-2 w-full">
                      <input
                        type="radio"
                        name={question.id}
                        value={0}
                        onChange={(e) => {
                          quiz.quizQuestions[i].answer = e.target.value;
                        }}
                      />
                      False <FaTimes className="text-error" />
                    </label>
                  </li>
                </ul>
              ) : question.questionType === "FILL_IN_THE_BLANK" ? (
                <input
                  type="text"
                  name={question.id}
                  className="input input-bordered w-full max-w-xs m-2 text-neutral-content"
                  placeholder="Enter your answer"
                  onChange={(e) => {
                    quiz.quizQuestions[i].answer = e.target.value;
                  }}
                />
              ) : null}
            </div>
          )
        )}
        <div className="flex justify-around mb-10">
          <button
            className="btn btn-primary"
            onClick={(e) => {
              e.preventDefault();
              submitQuiz();
            }}
          >
            Submit
          </button>
          <button
            className="btn btn-secondary"
            onClick={(e) => {
              e.preventDefault();
              abandonQuiz();
            }}
          >
            Abandon
          </button>
        </div>
      </div>
    </div>
  );
};
export default StartQuiz;
