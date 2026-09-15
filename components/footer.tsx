import Link from "next/link";
import { Logo } from "@/components/logo";
import { InstagramIcon, PinterestIcon } from "@/components/icons";
import { categories } from "@/lib/categories";
import { siteConfig } from "@/lib/site";

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const policyLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Cookie Policy", href: "/cookie-policy" },
  { label: "Disclosure", href: "/disclosure" },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-cream-300 bg-cream-200/60">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="space-y-4">
            <Link href="/" className="inline-block no-underline">
              <Logo />
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-ink-light">
              Honest motherhood. Purposeful parenting.
              {siteConfig.author.bio}
            </p>
            <div className="flex gap-3">
              <a
                href={siteConfig.social.pinterest}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Pinterest"
                className="rounded-full bg-terracotta-100 p-2 text-terracotta-700 no-underline hover:bg-terracotta-200"
              >
                <PinterestIcon className="h-5 w-5" />
              </a>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="rounded-full bg-terracotta-100 p-2 text-terracotta-700 no-underline hover:bg-terracotta-200"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          <nav aria-label="Explore" className="space-y-3">
            <h2 className="font-heading text-lg font-semibold text-ink">Explore</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/blog" className="text-ink-light no-underline hover:text-terracotta-600">
                  All Posts
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/${c.slug}`}
                    className="text-ink-light no-underline hover:text-terracotta-600"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company" className="space-y-3">
            <h2 className="font-heading text-lg font-semibold text-ink">Company</h2>
            <ul className="space-y-2 text-sm">
              {companyLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-ink-light no-underline hover:text-terracotta-600">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Policies" className="space-y-3">
            <h2 className="font-heading text-lg font-semibold text-ink">Policies</h2>
            <ul className="space-y-2 text-sm">
              {policyLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-ink-light no-underline hover:text-terracotta-600">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-cream-300 pt-6 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Raising On Purpose. All rights reserved.</p>
          <p>
            Made with purpose, coffee, and a patient toddler somewhere nearby.
          </p>
        </div>
      </div>
    </footer>
  );
}