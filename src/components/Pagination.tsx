import { useRouter, useSearchParams } from "next/navigation";

const Pagination = ({
  totalPages,
  pageNo,
  path,
}: {
  totalPages: number;
  pageNo: number;
  path: string;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams
    .get("search")
    ?.toLowerCase()
    .trim()
    .replace(/-/g, " ");
  const searchQuery = search ? `?search=${search}` : "";
  const filter = searchParams.get("filter")
    ?.toLowerCase()
    .trim()
    .replace(/-/g, " ");
  const filterQuery = filter ? `?filter=${filter}` : "";
  if (totalPages < 2) return null;
  return (
    <div className="flex justify-center my-10">
      <div className="join">
        {Array.from({ length: totalPages }).map((_, index) =>
          index === 0 ||
          index + 1 === totalPages ||
          (Number(pageNo - 2) - index < 2 && index - pageNo < 2) ? (
            <input
              key={index}
              className={`join-item btn btn-square`}
              type="radio"
              name="options"
              aria-label={`${index + 1}`}
              checked={index + 1 == pageNo}
              onChange={() => {
                router.push(`${path}/${index + 1}${searchQuery}${filterQuery}`);
              }}
            />
          ) : index === 1 || index === totalPages - 2 ? (
            <button key={index} className="join-item btn btn-square">
              ...
            </button>
          ) : null
        )}
      </div>
    </div>
  );
};

export default Pagination;
