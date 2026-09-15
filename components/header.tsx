import Link from "next/link";
import { Logo } from "@/components/logo";
import { MobileMenu } from "@/components/mobile-menu";
import { SearchButton } from "@/components/search-dialog";
import { navItems } from "@/lib/nav";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-cream-200 bg-cream-50/95 backdrop-blur supports-[backdrop-filter]:bg-cream-50/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="shrink-0 no-underline" aria-label="Raising On Purpose home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-5 lg:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[0.85rem] font-medium text-ink-light no-underline hover:text-terracotta-600"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/about"
            className="text-[0.85rem] font-medium text-ink-light no-underline hover:text-terracotta-600"
          >
            About
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <SearchButton className="rounded-lg p-2 text-ink hover:bg-cream-200" />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}