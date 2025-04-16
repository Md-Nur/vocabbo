const Checkbox = ({
  label,
  errors,
  isCheck = false,
  disabled = false,
  ...props
}: {
  label: string;
  errors?: { message?: string };
  isCheck?: boolean;
  disabled?: boolean;
}) => {
  return (
    <div className="form-control w-full">
      <label className="fieldset-label">
        <input
          type="checkbox"
          defaultChecked={isCheck}
          className="checkbox"
          {...props}
          disabled={disabled}
        />
        {label && <span className="label-text capitalize">{label}</span>}
      </label>
      {errors?.message && (
        <label className="label">
          <span className="label-text-alt text-error">{errors.message}</span>
        </label>
      )}
    </div>
  );
};

export default Checkbox;
