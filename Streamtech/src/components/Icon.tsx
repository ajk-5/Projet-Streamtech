interface IconProps {
  name: "film" | "tasks" | "mail" | "moon" | "sun" | "menu" | "close";
  className?: string;
}

function Icon({ name, className = "" }: IconProps) {
  return (
    <svg
      className={`app-icon ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {name === "film" && (
        <>
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path d="M7 3v18M17 3v18M3 8h4M3 16h4M17 8h4M17 16h4" />
          <path d="m10 9 4 3-4 3Z" />
        </>
      )}
      {name === "tasks" && (
        <>
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path d="m7 9 1.5 1.5L11 8M14 9h3M7 16h4M14 16h3" />
        </>
      )}
      {name === "mail" && (
        <>
          <rect x="3" y="5" width="18" height="14" rx="3" />
          <path d="m4 7 8 6 8-6" />
        </>
      )}
      {name === "moon" && (
        <path d="M20.5 13a8.5 8.5 0 0 1-9.5-9.5A8.5 8.5 0 1 0 20.5 13Z" />
      )}
      {name === "sun" && (
        <>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5" />
        </>
      )}
      {name === "menu" && <path d="M4 6h16M4 12h16M4 18h16" />}
      {name === "close" && <path d="m6 6 12 12M6 18 18 6" />}
    </svg>
  );
}

export default Icon;
