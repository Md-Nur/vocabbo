import Link from "next/link";
import React from "react";

const FeatureCards = () => {
  return (
    <div className="flex max-w-6xl mx-auto justify-around m-10 flex-wrap gap-2">
      <div className="card bg-base-100 dark:bg-base-200 shadow-sm w-72">
        <div className="card-body">
          <span className="text-2xl">🏆</span>
          <h3 className="card-title text-base-content">Daily Challenge</h3>
          <p className="text-base-content/80">
            Test your skills with a 5-minute quiz!
          </p>
          <Link href="/start-quiz" className="btn btn-primary btn-xs mt-2">
            Start Now
          </Link>
        </div>
      </div>
      <div className="card bg-base-100 dark:bg-base-200 shadow-sm w-72">
        <div className="card-body">
          <span className="text-2xl text-secondary">📈</span>
          <h3 className="card-title text-base-content">Your Progress</h3>
          <p className="text-base-content/80">
            <span className="font-bold text-secondary">15-day streak!</span>{" "}
            Keep going.
          </p>
          <progress
            className="progress progress-secondary w-full"
            value="75"
            max="100"
          ></progress>
        </div>
      </div>
      <div className="card bg-base-100 dark:bg-base-200 shadow-sm w-72">
        <div className="card-body">
          <span className="text-2xl text-primary">🏅</span>
          <h3 className="card-title text-base-content">Top Learners</h3>
          <div className="space-y-2 mt-2">
            <div className="flex items-center gap-2">
              <div className="avatar">👑</div>
              <span className="text-base-content">User123 (1200 XP)</span>
            </div>
            <Link
              href="/leaderboard"
              className="btn btn-xs btn-primary mt-2 w-full"
            >
              View Full Leaderboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureCards;
