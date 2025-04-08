import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent } from "react";

const Filter = ({ options }: { options: string[] }) => {
  const router = useRouter();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    router.push(`/word-list/${1}?filter=${e.target.value}`);
  };
  const searchParams = useSearchParams();
  const filter = searchParams
    .get("filter")
    ?.toLowerCase()
    .trim()
    .replace(/-/g, " ");

  return (
    <div className="filter p-3 mx-auto flex justify-center my-10">
      <input
        className="btn filter-reset"
        type="radio"
        name="metaframeworks"
        aria-label="All"
        onChange={handleChange}
        value=""
      />

      {options.map((option, index) => (
        <input
          key={index}
          className="btn"
          type="radio"
          name="metaframeworks"
          aria-label={option}
          onChange={handleChange}
          value={option}
          checked={filter === option.toLowerCase()}
        />
      ))}
    </div>
  );
};

export default Filter;
