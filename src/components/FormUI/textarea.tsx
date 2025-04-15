"use client";

import { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  errors?: { message?: string };
}

const Textarea = ({ label, errors, ...props }: TextareaProps) => {
  return (
    <div className="form-control w-full">
      {label && (
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
      )}
      <textarea className="textarea textarea-bordered textarea-accent w-full" {...props} />
      {errors?.message && (
        <label className="label">
          <span className="label-text-alt text-error">{errors.message}</span>
        </label>
      )}
    </div>
  );
};

export default Textarea;
