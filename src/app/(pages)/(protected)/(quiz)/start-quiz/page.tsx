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
import { toast } from "sonner";
import { getPreviousRoute } from "@/lib/utils";

const StartQuiz = () => {
  const user = useAppSelector((state) => state.user.user);
  const router = useRouter();
  const [duration, setDuration] = useState<number | null>(null);
  const modalRef = useRef<HTMLDialogElement>(null);
  const [isPageLoading, setIsPageLoading] = useState(false);

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
    if (isQuizAvailableSuccess && isQuizAvailable.isAvailable) {
      modalRef.current?.showModal();
      if (duration) {
        startQuiz();
      }
    } else if (isQuizAvailable) {
      toast.success("You have give today's quiz");
      let prevRoute = getPreviousRoute();
      if (prevRoute === "/start-quiz" || !prevRoute) {
        prevRoute = "/quiz-results";
      }
      router.push(prevRoute);
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
      // Set loading state before navigation
      setIsPageLoading(true);
      router.push(`/quiz-results/${data.id}`);
    },
    onError: (error) => {
      toast.error(
        isAxiosError(error) ? error.response?.data.error : error.message
      );
      console.log(error);
      setIsPageLoading(false);
    },
  });

  const { mutate: abandonQuiz, isPending: isAbandonQuizLoading } = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/quizzes/abandon", quiz);
      return response.data;
    },
    onSuccess: (data) => {
      console.log(data);
      router.push(getPreviousRoute());
    },
    onError: (error) => {
      console.log(error);
      toast.error(
        isAxiosError(error) ? error.response?.data.error : error.message
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitQuiz();
  };

  if (
    isQuizLoading ||
    isQuizAvailableLoading ||
    isSubmitQuizLoading ||
    isAbandonQuizLoading ||
    isPageLoading
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
        <Timer initialTime={quiz.quiz.duration * 60} onTimeUp={submitQuiz} />
      )}
      <h1 className="text-3xl md:text-5xl font-bold mt-10 items-start">Quiz</h1>
      <span className="text-sm mb-10 text-info opacity-65">
        ({quiz?.quizQuestions.length} questions)
      </span>
      <form onSubmit={handleSubmit} className="w-full">
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
              className="my-4 rounded-lg p-4 bg-base-200 mx-1"
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
                        value="F"
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
                  className="input input-bordered w-full max-w-xs m-2"
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
            className="btn btn-warning"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              abandonQuiz();
            }}
          >
            Abandon
          </button>
          <button className="btn btn-info" type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};
export default StartQuiz;
