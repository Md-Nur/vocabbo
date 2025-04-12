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
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">
          Enter the duration of the quiz
        </h3>
        {error && <p className="text-error">{error}</p>}
        <input
          type="number"
          className="input input-bordered w-full max-w-xs"
          onChange={(e) => setDur(parseInt(e.target.value))}
        />
        <div className="modal-action">
          <button
            className="btn btn-primary"
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
