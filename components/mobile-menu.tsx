"use client";

import { useState } from "react";
import Link from "next/link";
import { navItems } from "@/lib/nav";
import { CloseIcon, MenuIcon } from "@/components/icons";

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg p-2 text-ink hover:bg-cream-200 md:hidden"
        aria-label="Open menu"
      >
        <MenuIcon className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-cream-50 md:hidden">
      <div className="flex items-center justify-between border-b border-cream-200 px-4 py-3">
        <p className="font-heading text-xl font-semibold text-ink">Menu</p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg p-2 text-ink hover:bg-cream-200"
          aria-label="Close menu"
        >
          <CloseIcon className="h-6 w-6" />
        </button>
      </div>
      <nav className="flex flex-col gap-1 px-4 py-6" aria-label="Mobile navigation">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className="rounded-lg px-3 py-3 font-heading text-xl text-ink no-underline hover:bg-cream-200"
          >
            {item.label}
          </Link>
        ))}
        <div className="my-4 h-px bg-cream-300" />
        <Link
          href="/about"
          onClick={() => setOpen(false)}
          className="rounded-lg px-3 py-3 font-heading text-xl text-ink no-underline hover:bg-cream-200"
        >
          About
        </Link>
        <Link
          href="/contact"
          onClick={() => setOpen(false)}
          className="rounded-lg px-3 py-3 font-heading text-xl text-ink no-underline hover:bg-cream-200"
        >
          Contact
        </Link>
      </nav>
    </div>
  );
}