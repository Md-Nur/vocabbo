"use client";
import { Word } from "@prisma/client";
import Link from "next/link";

const Words = ({ words }: { words: Word[] }) => {
  return (
    <div className="flex flex-col justify-center items-center md:items-stretch gap-5 md:flex-row flex-wrap my-10">
      {words.map((word) => (
        <Link
          href={`/word/${word?.id}`}
          key={word?.id}
          className="card bg-base-200 w-80 sm:w-96 shadow-sm"
        >
          {word?.imageUrl && (
            <figure>
              <img
                src={word?.imageUrl || "abc.png"}
                alt={word.word}
                width={400}
                height={300}
                className="w-full h-72 object-cover"
              />
            </figure>
          )}
          <div className="card-body">
            <h2 className="card-title">{word.word}</h2>
            <p>{word.meaning}</p>
            <div className="card-actions justify-end">
              <div className="badge badge-neutral">{word.category}</div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Words;
