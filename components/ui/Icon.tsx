

type IconName =
  | "book"
  | "calendar"
  | "check"
  | "clock"
  | "file"
  | "grid"
  | "message"
  | "play"
  | "search"
  | "star"
  | "user"
  | "users";

type IconProps = {
  name: IconName;
  size?: number | string;
};

export function Icon({ name, size = 20 }: IconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": true,
  };

  const paths: Record<IconName, React.ReactNode> = {
    book: (
      <>
        <path d="M5 5.7C5 4.76 5.76 4 6.7 4H20v15H6.7A1.7 1.7 0 0 1 5 17.3V5.7Z" />
        <path d="M5 17.2A2.8 2.8 0 0 1 7.8 14.4H20" />
        <path d="M9 7.5h6" />
      </>
    ),
    calendar: (
      <>
        <path d="M6 4v3M18 4v3" />
        <path d="M4.5 8.5h15" />
        <path d="M6.2 6h11.6c.94 0 1.7.76 1.7 1.7v10.1c0 .94-.76 1.7-1.7 1.7H6.2c-.94 0-1.7-.76-1.7-1.7V7.7c0-.94.76-1.7 1.7-1.7Z" />
      </>
    ),
    check: (
      <>
        <path d="M20 7 9.8 17.2 4 11.4" />
      </>
    ),
    clock: (
      <>
        <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
        <path d="M12 7.5V12l3.2 2" />
      </>
    ),
    file: (
      <>
        <path d="M7 3.5h6l4 4v13H7v-17Z" />
        <path d="M13 3.5v4h4" />
        <path d="M9.5 12h5M9.5 15.5h5" />
      </>
    ),
    grid: (
      <>
        <path d="M4.5 4.5h6v6h-6v-6ZM13.5 4.5h6v6h-6v-6ZM4.5 13.5h6v6h-6v-6ZM13.5 13.5h6v6h-6v-6Z" />
      </>
    ),
    message: (
      <>
        <path d="M5 5.5h14v10H8.8L5 19.1V5.5Z" />
        <path d="M8.5 9h7M8.5 12.2h4.5" />
      </>
    ),
    play: (
      <>
        <path d="m9 7 8 5-8 5V7Z" />
      </>
    ),
    search: (
      <>
        <path d="M10.8 17.1a6.3 6.3 0 1 0 0-12.6 6.3 6.3 0 0 0 0 12.6Z" />
        <path d="m15.5 15.5 4 4" />
      </>
    ),
    star: (
      <>
        <path d="m12 3.8 2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.6-4.8 2.6.9-5.4-3.9-3.8 5.4-.8L12 3.8Z" />
      </>
    ),
    user: (
      <>
        <path d="M12 12.2a4.1 4.1 0 1 0 0-8.2 4.1 4.1 0 0 0 0 8.2Z" />
        <path d="M4.8 20.1c.8-4.1 3.3-6.1 7.2-6.1s6.4 2 7.2 6.1" />
      </>
    ),
    users: (
      <>
        <path d="M9.5 11.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
        <path d="M3.5 19.5c.6-3.2 2.7-5 6-5s5.4 1.8 6 5" />
        <path d="M16.2 11.2a2.9 2.9 0 0 0 0-5.4" />
        <path d="M17 14.7c2 .5 3.2 2.1 3.5 4.8" />
      </>
    ),
  };

  return (
    <svg
      {...common}
      className="icon"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}
