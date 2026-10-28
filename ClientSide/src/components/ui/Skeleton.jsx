export default function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-[#111827] via-[#1F2937] to-[#111827] bg-[length:200%_100%] rounded-lg ${className}`}
      style={{ animation: 'shimmer 2s infinite' }}
    />
  );
}