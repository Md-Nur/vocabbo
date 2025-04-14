"use client";
import { useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

const ThemeToggle = () => {
  const [theme, setTheme] = useState<string>("vocabbo-light");

  useEffect(() => {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setTheme("vocabbo-dark");
    } else {
      setTheme("vocabbo-light");
    }
  }, []);

  return (
    <label className="swap swap-rotate transition-all duration-300 ml-5">
      {/* this hidden checkbox controls the state */}
      <input
        type="checkbox"
        className="theme-controller"
        value={theme}
        onChange={() => {
          const newTheme =
            theme === "vocabbo-light" ? "vocabbo-dark" : "vocabbo-light";
          setTheme(newTheme);
        }}
      />

      {/* sun icon */}
      <FaSun className="swap-off h-6 w-6 fill-current text-warning" />

      {/* moon icon */}
      <FaMoon className="swap-on h-6 w-6 fill-current text-info" />
    </label>
  );
};

export default ThemeToggle;
