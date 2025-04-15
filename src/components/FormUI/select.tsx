"use client";

import { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  errors?: { message?: string };
  options: { label?: string; value: string }[];
  defaultValue?: string;
}

const Select = ({
  label,
  errors,
  options,
  defaultValue,
  ...props
}: SelectProps) => {
  return (
    <div className="form-control w-full">
      {label && (
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
      )}
      <select
        className="select select-bordered w-full select-accent"
        defaultValue={defaultValue || ""}
        {...props}
      >
        <option value="" disabled>
          Select an option
        </option>
        {options.map((option) => (
          <option
            className="capitalize"
            key={option.value}
            value={option.value}
          >
            {option?.label || option.value}
          </option>
        ))}
      </select>
      {errors?.message && (
        <label className="label">
          <span className="label-text-alt text-error">{errors.message}</span>
        </label>
      )}
    </div>
  );
};

export default Select;
