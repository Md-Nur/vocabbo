import { getPreviousRoute } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { RefObject, useState } from "react";

const DurationModal = ({
  setDuration,
  modalRef,
}: {
  setDuration: (duration: number) => void;
  modalRef: RefObject<HTMLDialogElement>;
}) => {
  const [dur, setDur] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const router = useRouter();
  return (
    <dialog
      ref={modalRef}
      id="duration-modal"
      className="modal modal-bottom sm:modal-middle"
    >
      <div className="modal-box flex flex-col gap-4 items-center justify-center">
        <h3 className="font-bold text-xl my-4">
          Enter the duration of the quiz
        </h3>
        {error && <p className="text-error">{error}</p>}
        <div className="my-2 w-full max-w-sm">
          <input
            type="number"
            className="input input-bordered w-full"
            onChange={(e) => setDur(parseInt(e.target.value))}
            placeholder="Enter duration in minutes (Minimum 3)"
            min={3}
          />
          <div className="flex justify-around my-5">
            <button
              className="btn btn-primary join-item"
              onClick={() => {
                if (dur < 3) {
                  setError("Duration must be at least 3 minutes");
                  return;
                } else if (dur > 0) {
                  setDuration(dur);
                  modalRef.current?.close();
                }
              }}
            >
              Start Quiz
            </button>
            <button
              className="btn btn-error join-item"
              onClick={() => {
                modalRef.current?.close();
                router.push(getPreviousRoute());
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default DurationModal;
