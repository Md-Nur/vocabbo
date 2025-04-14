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
        <div className="join my-4">
        <input
          type="number"
          className="input input-bordered w-full max-w-xs join-item"
          onChange={(e) => setDur(parseInt(e.target.value))}
        />
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
        </div>
      </div>
    </dialog>
  );
};

export default DurationModal;
