export function Card({ className = "", ...props }) {
  return (
    <div
      className={`rounded-2xl border border-orange-300/[0.12] bg-surface/80 shadow-[0_18px_60px_rgba(80,35,9,0.10)] backdrop-blur-xl ${className}`}
      {...props}
    />
  );
}

export function CardHeader({ className = "", ...props }) {
  return <div className={`p-6 pb-0 ${className}`} {...props} />;
}

export function CardTitle({ className = "", ...props }) {
  return (
    <h2
      className={`text-lg font-bold tracking-tight text-foreground ${className}`}
      {...props}
    />
  );
}

export function CardDescription({ className = "", ...props }) {
  return (
    <p className={`mt-2 text-sm leading-6 text-muted ${className}`} {...props} />
  );
}

export function CardContent({ className = "", ...props }) {
  return <div className={`p-6 ${className}`} {...props} />;
}

export function CardFooter({ className = "", ...props }) {
  return (
    <div
      className={`flex items-center gap-3 border-t border-white/[0.07] p-6 ${className}`}
      {...props}
    />
  );
}

export default Card;