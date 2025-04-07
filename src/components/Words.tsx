"use client";
import { Word } from "@prisma/client";

const Words = ({ words }: { words: Word[] }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-5 md:flex-row flex-wrap">
      {words.map((word) => (
        <div key={word?.id} className="card bg-base-200 w-72 sm:w-96 shadow-sm">
          {word?.imageUrl && (
            <figure>
              <img
                src={word?.imageUrl || "abc.png"}
                alt={word.word}
                width={400}
                height={300}
                className="w-full h-full object-cover"
              />
            </figure>
          )}
          <div className="card-body">
            <h2 className="card-title">{word.word}</h2>
            <p>{word.meaning}</p>
            <div className="card-actions justify-end">
              <div className="badge badge-secondary">{word.category}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Words;
