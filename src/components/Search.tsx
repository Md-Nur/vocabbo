import { IoMdSearch } from "react-icons/io";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
const Search = () => {
  const searchParams = useSearchParams();
  const search = searchParams
    .get("search")
    ?.toLowerCase()
    .trim()
    .replace(/-/g, " ");
  const [searchWord, setSearchWord] = useState(search || "");
  const router = useRouter();
  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(
      `/word-list/${1}?search=${searchWord
        .toLowerCase()
        .trim()
        .replace(/ /g, "-")}`
    );
  };
  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center justify-center my-10 join px-5"
    >
      <label className="input">
        <IoMdSearch className="w-5 h-5" />
        <input
          type="search"
          className="grow"
          placeholder="Search Word"
          onChange={(e) => setSearchWord(e.target.value)}
          defaultValue={search}
        />
      </label>
      <button className="btn btn-info" type="submit">
        Search
      </button>
    </form>
  );
};

export default Search;
