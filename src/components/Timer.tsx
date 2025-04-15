"use client";
import { useEffect, useState } from "react";

interface TimerProps {
  initialTime: number; // in seconds
  onTimeUp?: () => void;
}

const Timer = ({ initialTime, onTimeUp }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(Math.max(0, initialTime || 0));
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const minutes = Math.floor(Math.max(0, timeLeft) / 60);
  const seconds = Math.max(0, timeLeft) % 60;

  return (
    <div className="grid grid-flow-col gap-5 text-center auto-cols-max fixed top-20 right-7 z-10">
      <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
        <span className="countdown font-mono text-5xl">
          <span
            style={{ "--value": minutes } as React.CSSProperties}
            aria-live="polite"
            aria-label={minutes.toString()}
          >
            {minutes.toString().padStart(2, "0")}
          </span>
        </span>
        min
      </div>
      <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
        <span className="countdown font-mono text-5xl">
          <span
            style={{ "--value": seconds } as React.CSSProperties}
            aria-live="polite"
            aria-label={seconds.toString()}
          >
            {seconds.toString().padStart(2, "0")}
          </span>
        </span>
        sec
      </div>
    </div>
  );
};

export default Timer;
