export interface NavItem {
  label: string;
  href: string;
}

export const navItems: NavItem[] = [
  { label: "Blog", href: "/blog" },
  { label: "Intentional Parenting", href: "/intentional-parenting" },
  { label: "Real Talk", href: "/real-talk" },
  { label: "Toddler & Early Childhood", href: "/toddler" },
  { label: "Family Routines", href: "/family-routines" },
  { label: "Printables", href: "/printables" },
];

export const topNavLabels: Record<string, string> = {
  "/blog": "Blog",
  "/intentional-parenting": "Intentional Parenting",
  "/real-talk": "Real Talk",
  "/toddler": "Toddler",
  "/family-routines": "Routines",
  "/printables": "Printables",
};