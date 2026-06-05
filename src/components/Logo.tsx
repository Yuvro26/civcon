import { Link } from "@tanstack/react-router";

export function Logo({
  className = "",
  showText = true,
}: {
  className?: string;
  showText?: boolean;
}) {
  return (
    <Link to="/" className={`flex items-center gap-2.5 ${className}`}>
      <span className="relative inline-flex h-10 w-10 items-center justify-center">
        <svg
          viewBox="0 0 48 48"
          fill="none"
          className="h-10 w-10 drop-shadow-[0_0_12px_oklch(0.7_0.16_215_/_50%)]"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="cc-grad" x1="0" y1="0" x2="48" y2="48">
              <stop offset="0%" stopColor="oklch(0.74 0.16 210)" />
              <stop offset="100%" stopColor="oklch(0.62 0.2 285)" />
            </linearGradient>
          </defs>
          {/* Shield + pin body */}
          <path
            d="M24 3l16 6v11c0 9.5-6.4 18.2-16 22-9.6-3.8-16-12.5-16-22V9l16-6z"
            fill="url(#cc-grad)"
            opacity="0.18"
          />
          <path
            d="M24 3l16 6v11c0 9.5-6.4 18.2-16 22-9.6-3.8-16-12.5-16-22V9l16-6z"
            stroke="url(#cc-grad)"
            strokeWidth="1.6"
            fill="none"
          />
          {/* City skyline */}
          <g fill="url(#cc-grad)">
            <rect x="14" y="24" width="4" height="9" rx="1" />
            <rect x="20" y="19" width="4.5" height="14" rx="1" />
            <rect x="27" y="22" width="4" height="11" rx="1" />
          </g>
          {/* Location pin */}
          <circle cx="24" cy="15" r="4.2" fill="oklch(0.16 0.03 264)" />
          <circle cx="24" cy="15" r="2" fill="url(#cc-grad)" />
        </svg>
      </span>
      {showText && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-lg font-bold tracking-tight">
            Civic<span className="text-gradient">Connect</span>
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Citizen Platform
          </span>
        </span>
      )}
    </Link>
  );
}
