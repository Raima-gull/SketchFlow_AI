export default function Textarea({ label, error, helperText, className = '', ...props }) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-[#C4B5FD] mb-1.5">{label}</label>}
      <textarea
        className={`w-full px-4 py-3 bg-[#0A0F1D] border ${
          error ? 'border-red-500' : 'border-[rgba(56,189,248,0.2)]'
        } rounded-xl text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:border-[#38BDF8] focus:shadow-[0_0_15px_rgba(56,189,248,0.15)] transition-all resize-none ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}
      {helperText && !error && <p className="text-xs text-[#94A3B8] mt-1.5">{helperText}</p>}
    </div>
  );
}