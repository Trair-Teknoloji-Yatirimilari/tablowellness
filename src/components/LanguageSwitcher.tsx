import { useT } from "@/i18n/context";
import { LOCALES, localeLabels, localeFlags, localeFullNames, type Locale } from "@/i18n/types";
import { Globe } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function LanguageSwitcher({
  variant = "header",
  compact = false,
}: {
  variant?: "header" | "footer";
  /** Dar ekranlarda sadece bayrak gosterir (globe ikonu ve dil kodu gizlenir). */
  compact?: boolean;
}) {
  const { locale, setLocale } = useT();
  const applyLocale = (l: typeof locale) => {
    setLocale(l);
    try {
      const url = new URL(window.location.href);
      if (l === "tr") url.searchParams.delete("lang");
      else url.searchParams.set("lang", l);
      window.history.replaceState({}, "", url.toString());
    } catch {}
  };
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const base =
    variant === "header"
      ? "inline-flex items-center gap-1.5 rounded-full border border-border/50 px-3 py-1.5 text-[11px] uppercase tracking-widest text-foreground/80 hover:border-primary/60 hover:text-primary transition-colors"
      : "inline-flex items-center gap-1.5 text-xs text-foreground/60 hover:text-primary transition-colors";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={base}
        aria-label="Language / Dil"
      >
        <Globe className={`w-3.5 h-3.5 ${compact ? "hidden sm:inline-block" : ""}`} />
        <span className="text-sm leading-none">{localeFlags[locale]}</span>
        <span className={compact ? "hidden sm:inline" : ""}>{localeLabels[locale]}</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 min-w-[140px] rounded-md border border-border/60 bg-background/95 backdrop-blur py-1 shadow-lg z-50">
          {LOCALES.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => { applyLocale(l as Locale); setOpen(false); }}
              className={`flex w-full items-center gap-2 text-left px-3 py-1.5 text-xs hover:bg-primary/10 ${l === locale ? "text-primary" : "text-foreground/80"}`}
            >
              <span className="text-base leading-none">{localeFlags[l]}</span>
              <span>{localeFullNames[l]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
