export type NavBarVariant = "home" | "faq";

export const navBarData = {
  items: [
    { label: "Wykładowcy(soon)", href: "/lecturers" },
    { label: "Materiały", href: "/materials" },
    { label: "Społeczność(soon)", href: "/community" },
    { label: "FAQ", href: "/faq" },
  ],
  action: {
    label: "Zaloguj",
    href: "/login",
    showBackArrow: false,
  },
};
