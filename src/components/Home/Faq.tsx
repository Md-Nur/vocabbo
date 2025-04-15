import React from "react";
import Title from "../Title";
const faqs = [
  {
    question: "What is Vocabbo?",
    answer:
      "Vocabbo is an online platform to help you learn new words through interactive quizzes, personalized learning paths, and a competitive leaderboard.",
  },
  {
    question: "Is Vocabbo free to use?",
    answer:
      "Yes! Vocabbo offers free access to core features. Premium features may be added later for extra benefits.",
  },
  {
    question: "What languages can I learn vocabulary in?",
    answer:
      "Vocabbo supports multiple languages and we’re constantly adding more based on user demand.",
  },
  {
    question: "Who is Vocabbo for?",
    answer:
      "Students, competitive exam takers, language learners, or anyone who wants to grow their vocabulary in a fun way!",
  },
  {
    question: "How is Vocabbo different from traditional vocabulary learning?",
    answer:
      "Unlike textbooks or rote learning, Vocabbo is interactive, fun, and personalized. You learn at your own pace, track progress, and even compete with others.",
  },
  {
    question: "Can I track my progress?",
    answer:
      "Yes! Your progress is saved automatically. You can view your stats, quiz scores, and ranking anytime.",
  },
  {
    question: "Is Vocabbo mobile-friendly?",
    answer:
      "Absolutely! You can use Vocabbo on any device — desktop, tablet, or mobile.",
  },
];

const Faq = () => {
  return (
    <div className="my-20 max-w-6xl mx-auto">
      <Title>FAQ</Title>
      <p className="text-center max-w-lg mx-auto mb-7">
        Have questions? We have answers! Check out our frequently asked
        questions below.
      </p>
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="collapse collapse-arrow bg-base-100 border border-base-300"
        >
          <input
            type="radio"
            name="my-accordion-2"
            defaultChecked={index === 0}
          />
          <div className="collapse-title font-semibold">
            <span className="text-lg">{faq.question}</span>
          </div>
          <div className="collapse-content text-sm">
            <p>{faq.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Faq;
