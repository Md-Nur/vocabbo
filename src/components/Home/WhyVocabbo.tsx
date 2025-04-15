import Image from "next/image";
import Title from "../Title";

const keyFeatures = [
  {
    title: "Multilingual Vocabulary Learning",
    description:
      "Vocabbo supports learning across multiple languages, not just English—making it perfect for diverse users and global learners who want to master vocabulary in Bangla, French, Spanish, and more.",
    bgColor: "text-primary",
    image: "/images/multilingual.png",
  },
  {
    title: "Interactive Quizzes And Games",
    description:
      "Engaging quizzes like multiple-choice, audio-based, and fill-in-the-blanks turn vocabulary practice into a fun, game-like experience that enhances memory through repetition and challenge.",

    bgColor: "text-secondary",
    image: "/images/quizzes.png",
  },
  {
    title: "Personalized Word Lists",
    description:
      "Users can save, categorize, and revisit tricky words by creating custom word lists—perfect for exam prep, topic-based learning, or building a personal vocabulary bank.",
    bgColor: "text-accent",
    image: "/images/personalized.png",
  },
  {
    title: "Leaderboard And Social Motivation",
    description:
      "Stay motivated by competing with friends and other learners through a dynamic leaderboard system that rewards consistency, accuracy, and learning streaks.",
    bgColor: "text-info",
    image: "/images/leaderboard.png",
  },
  {
    title: "Clean And User-Friendly Interface",
    description:
      "Inspired by Google’s minimal design, Vocabbo offers a distraction-free, mobile-optimized experience that’s fast, smooth, and easy for learners of all ages to navigate.",
    bgColor: "text-success",
    image: "/images/clean.png",
  },
];

const WhyVocabbo = () => {
  return (
    <div className="w-full my-16 max-w-6xl mx-auto">
      <Title>
        ✅ Why&nbsp;
        <span className="text-primary">Vocabbo?</span>
      </Title>
      <p className="text-center max-w-xl mx-auto">
        Because learning new words shouldn&apos;t feel like a chore — Vocabbo makes
        it fun, competitive, and effective for learners of all levels.
      </p>
      <div className="flex flex-col items-center">
        {keyFeatures.map((feature, index) => (
          <div
            key={index}
            className={`flex flex-col bg-base-200 m-10 rounded-3xl p-10 gap-10 ${
              index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            } bg-base-300`}
          >
            <div className="leading-10">
              <h3 className="text-2xl font-bold my-5">
                {feature.title.split(" ").map((word, i) => (
                  <span
                    className={`${i % 2 === 1 ? `${feature.bgColor}` : ""}`}
                    key={i}
                  >
                    {word}
                    <span className="text-primary">
                      {i === feature.title.split(" ").length - 1 ? "" : " "}
                    </span>
                  </span>
                ))}
              </h3>
              <p className="">{feature.description}</p>
            </div>
            <div className="w-full max-w-xl shadow">
              <div className="mockup-browser border border-base-300 w-full">
                <div className="mockup-browser-toolbar">
                  <div className="input">https://vacabboai.com</div>
                </div>
                <div className="grid place-content-center h-44">
                  <Image
                    width={500}
                    height={500}
                    src={"/abc.png"}
                    alt={feature.title}
                    className="w-full h-40 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyVocabbo;
