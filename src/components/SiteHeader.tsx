import { Link } from "@tanstack/react-router";
import { MessageCircle, Phone } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useT } from "@/i18n/context";
import { SITE, whatsappUrl } from "@/data/site";

/**
 * Ana sayfa disindaki sayfalar (hizmetler, blog, kvkk) icin sade ust bar.
 * Ana sayfanin kendi overlay navigasyonu ayridir, ona dokunulmaz.
 */
export function SiteHeader() {
  const { t } = useT();

  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:gap-4 sm:px-6 lg:px-10">
        <Link to="/" className="shrink-0">
          <img
            src="/medya/logo.webp"
            alt={SITE.name}
            width={180}
            height={78}
            className="h-9 w-auto"
          />
        </Link>

        <nav className="flex shrink-0 items-center gap-3 text-xs uppercase tracking-[0.2em] text-foreground/70 sm:gap-5">
          <Link to="/hizmetler" className="hidden sm:inline hover:text-primary transition-colors">
            {t.nav.services}
          </Link>
          <a href="/#iletisim" className="hidden md:inline hover:text-primary transition-colors">
            {t.nav.contact}
          </a>
          <a
            href={`tel:${SITE.phone}`}
            aria-label={`${t.contact.cards.phone}: ${SITE.phoneDisplay}`}
            className="hidden items-center gap-2 whitespace-nowrap text-foreground/70 transition-colors hover:text-primary lg:inline-flex"
          >
            <Phone className="h-3.5 w-3.5" strokeWidth={1.6} />
            {SITE.phoneDisplay}
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-primary px-3 py-2 text-[10px] tracking-[0.2em] text-primary-foreground transition-colors hover:bg-primary/90 sm:px-4"
          >
            <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.8} />
            WhatsApp
          </a>
          <LanguageSwitcher compact />
        </nav>
      </div>
    </header>
  );
}
