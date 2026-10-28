import { useId } from "react";

export default function Input({
  id,
  label,
  error,
  hint,
  className = "",
  type = "text",
  ...props
}) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const messageId = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

  return (
    <div className="w-full">
      <div className="relative">
        <input
          id={inputId}
          type={type}
          placeholder=" "
          aria-invalid={Boolean(error)}
          aria-describedby={messageId}
          className={`peer h-14 w-full rounded-xl border bg-[#121212]/75 px-4 pb-1 pt-5 text-sm text-foreground outline-none transition placeholder:text-transparent focus:ring-2 ${
            error
              ? "border-rose-400/50 focus:border-rose-400 focus:ring-rose-400/10"
              : "border-white/10 focus:border-accent/60 focus:ring-accent/10"
          } ${className}`}
          {...props}
        />
        {label && (
          <label
            htmlFor={inputId}
            className="pointer-events-none absolute left-4 top-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted transition-all peer-placeholder-shown:top-[18px] peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-[0.12em] peer-focus:text-accent-soft"
          >
            {label}
          </label>
        )}
      </div>

      {error ? (
        <p id={messageId} role="alert" className="mt-2 text-xs text-rose-300">
          {error}
        </p>
      ) : hint ? (
        <p id={messageId} className="mt-2 text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}