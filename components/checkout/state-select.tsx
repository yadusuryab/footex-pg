"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { INDIAN_STATES } from "@/lib/indian-states";

export function StateSelect({
  id = "state",
  value,
  onChange,
  onClose,
  hasError = false,
}: {
  id?: string;
  value: string;
  onChange: (state: string) => void;
  onClose?: () => void;
  hasError?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? INDIAN_STATES.filter((s) => s.toLowerCase().includes(q))
      : INDIAN_STATES;
  }, [query]);

  const close = () => {
    setOpen(false);
    setQuery("");
    onClose?.();
  };

  const select = (state: string) => {
    onChange(state);
    close();
  };

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      document.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (open) searchRef.current?.focus();
  }, [open]);

  return (
    <div ref={rootRef} className="relative mt-1.5">
      <button
        type="button"
        id={id}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-invalid={hasError}
        onClick={() => (open ? close() : setOpen(true))}
        className={cn(
          "flex h-11 w-full items-center justify-between rounded-xl border border-border bg-muted/30 px-3 text-left text-sm transition-colors hover:bg-muted/50 focus-visible:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          hasError && "border-red-400 bg-red-50/50 focus-visible:ring-red-400",
        )}
      >
        <span className={cn("truncate", !value && "text-muted-foreground")}>
          {value || "Select your state"}
        </span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute z-50 mt-1.5 w-full overflow-hidden rounded-xl border border-border bg-background shadow-lg">
          <div className="flex items-center gap-2 border-b border-border px-3">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (filtered[0]) select(filtered[0]);
                }
              }}
              placeholder="Search state"
              className="h-10 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>

          <ul role="listbox" className="max-h-56 overflow-y-auto p-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-6 text-center text-sm text-muted-foreground">
                No state found
              </li>
            ) : (
              filtered.map((state) => {
                const selected = state === value;
                return (
                  <li key={state} role="option" aria-selected={selected}>
                    <button
                      type="button"
                      onClick={() => select(state)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-muted",
                        selected && "bg-muted font-medium",
                      )}
                    >
                      <span className="truncate">{state}</span>
                      {selected && <Check className="h-4 w-4 shrink-0" />}
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}