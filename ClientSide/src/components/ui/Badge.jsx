export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-[#1F2937] text-[#94A3B8]',
    primary: 'bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/30',
    success: 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30',
    warning: 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30',
    error: 'bg-red-500/20 text-red-400 border border-red-500/30',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}