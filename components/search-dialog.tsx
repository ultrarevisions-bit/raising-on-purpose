"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { categories } from "@/lib/categories";
import type { PostMeta } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CloseIcon, SearchIcon } from "@/components/icons";

type SearchItem = Pick<PostMeta, "title" | "slug" | "category" | "excerpt" | "date" | "featuredImage">;

export function SearchButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent("open-search"))}
      className={className}
      aria-label="Search the blog"
    >
      <SearchIcon className="h-5 w-5" />
    </button>
  );
}

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<SearchItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const openSearch = () => setOpen(true);
    window.addEventListener("open-search", openSearch);

    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("open-search", openSearch);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    let active = true;
    fetch("/search-index.json", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : []))
      .then((data: SearchItem[]) => {
        if (active) setItems(data);
      })
      .catch(() => {
        if (active) setItems([]);
      });
    return () => {
      active = false;
    };
  }, []);

  const onDocumentKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false);
  }, []);
  useEffect(() => {
    document.addEventListener("keydown", onDocumentKey);
    return () => document.removeEventListener("keydown", onDocumentKey);
  }, [onDocumentKey]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return items.filter((item) => {
      const haystack = `${item.title} ${item.excerpt} ${item.category}`.toLowerCase();
      return q
        .split(/\s+/)
        .every((part) => part.length > 0 && haystack.includes(part.trim()));
    });
  }, [query, items]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-ink/50 p-4 pt-[12vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Search posts"
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-cream-200 px-4 py-3">
          <SearchIcon className="h-5 w-5 text-ink-muted" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts, topics, printables..."
            className="w-full bg-transparent py-1 text-ink outline-none placeholder:text-ink-muted"
            autoComplete="off"
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close search"
            className="rounded-full p-1.5 text-ink-muted hover:bg-cream-100 hover:text-ink"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-3">
          {query.trim() === "" ? (
            <div className="grid gap-4 p-2 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  Browse by category
                </p>
                <ul className="space-y-1.5">
                  {categories.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/${c.slug}`}
                        onClick={() => setOpen(false)}
                        className="text-sm text-terracotta-600 no-underline hover:underline"
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-sm leading-relaxed text-ink-muted">
                Press <kbd className="rounded bg-cream-100 px-1.5 py-0.5 font-sans">Ctrl</kbd> +{" "}
                <kbd className="rounded bg-cream-100 px-1.5 py-0.5 font-sans">K</kbd> to open
                search from anywhere.
              </p>
            </div>
          ) : results.length === 0 ? (
            <p className="p-4 text-center text-sm text-ink-muted">
              Nothing matches "{query}". Try a different word.
            </p>
          ) : (
            <ul className={cn("divide-y divide-cream-100")}>
              {results.slice(0, 12).map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/${item.category}/${item.slug}`}
                    onClick={() => {
                      setOpen(false);
                      setQuery("");
                    }}
                    className="flex gap-3 rounded-lg p-2.5 transition-colors hover:bg-cream-100"
                  >
                    <div className="relative h-14 w-11 shrink-0 overflow-hidden rounded">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.featuredImage}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink leading-snug">{item.title}</p>
                      <p className="mt-0.5 text-xs text-ink-muted">{item.category.replaceAll("-", " ")}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}