export type NavBarVariant = "home" | "faq";

export const navBarData = {
  items: [
    { label: "Wykładowcy(soon)", href: "/" },
    { label: "Materiały", href: "/materials" },
    { label: "Społeczność(soon)", href: "/" },
    { label: "FAQ", href: "/faq" },
  ],
  action: {
    label: "Dołącz",
    href: "/register",
    showBackArrow: false,
  },
};
