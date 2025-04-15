import { FaCheck, FaCross, FaTimes } from "react-icons/fa";
import Title from "../Title";

const TradicionalLearning = [
  "Expensive teacher fees",
  "Fixed schedules, no flexibility",
  "Classroom environment, not personalized",
  "Teacher-centric, limited self-learning",
  "One-size-fits-all syllabus",
  "Boring memorization techniques",
  "Limited language options",
  "No instant progress feedback",
  "Lack of motivation",
];

const VocabboLearning = [
  "Cost-effective alternative",
  "On-demand, flexible learning",
  "In-depth personalized experience",
  "Empowers self-paced learning",
  "Tailor-made curriculum for each learner",
  "Fun, interactive quizzes & challenges",
  "Supports multiple languages",
  "Real-time progress tracking & insights",
  "Leaderboard & gamification keep you engaged",
];

const Comparison = () => {
  return (
    <div className="my-20 max-w-6xl mx-auto">
      <Title>Better Than Traditional Learning</Title>
      <div className="flex w-full flex-col lg:flex-row">
        <div className="card bg-base-300 rounded-box grid grow place-items-center py-5">
          <h3 className="my-3 text-xl text-center font-semibold">
            Traditional Learning
          </h3>
          <p>
            
          </p>
          <ul className="list-inside list-none text-left">
            {TradicionalLearning.map((item, index) => (
              <li key={index} className="flex gap-1 items-center my-2 bg-red-200 text-red-800 font-semibold p-2 rounded">
                <FaTimes className="" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="divider lg:divider-horizontal">VS</div>
        <div className="card bg-base-300 rounded-box grid grow place-items-center py-3">
          <h3 className="my-3 text-xl text-center font-semibold">Vocabbo</h3>
          <ul className="list-inside list-none text-left">
            {VocabboLearning.map((item, index) => (
              <li
                key={index}
                className="flex gap-1 items-center my-2 bg-green-200 text-green-800 font-semibold p-2 rounded"
              >
                <FaCheck className="" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Comparison;
