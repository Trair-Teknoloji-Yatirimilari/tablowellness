import { Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Instagram } from "lucide-react";
import { useT } from "@/i18n/context";
import { SERVICES } from "@/data/services";
import { SITE, mapsUrl } from "@/data/site";

export function SiteFooter() {
  const { t } = useT();
  const addressLines = t.footer.address.split("\n");
  return (
    <footer className="relative border-t border-border/40 py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid md:grid-cols-4 gap-10 md:gap-8 items-start">
          <div>
            <span className="text-gold-gradient font-display text-lg tracking-wide whitespace-nowrap block">
              {t.nav.brand}
            </span>
            <span className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground mt-2 block">
              {t.footer.tagline}
            </span>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground">{t.footer.contactHeader}</h4>
            <a href={`tel:${SITE.phone}`} className="flex items-center gap-3 text-sm text-foreground/80 hover:text-primary transition-colors">
              <Phone className="w-4 h-4 text-primary" strokeWidth={1.5} />
              {SITE.phoneDisplay}
            </a>
            <a href={`mailto:${SITE.email}`} className="flex items-center gap-3 text-sm text-foreground/80 hover:text-primary transition-colors">
              <Mail className="w-4 h-4 text-primary" strokeWidth={1.5} />
              {SITE.email}
            </a>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 text-sm text-foreground/80 hover:text-primary transition-colors"
            >
              <MapPin className="w-4 h-4 text-primary mt-0.5" strokeWidth={1.5} />
              <span>
                {addressLines.map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < addressLines.length - 1 && <br />}
                  </span>
                ))}
              </span>
            </a>
          </div>

          <div>
            <h4 className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-4">{t.nav.services}</h4>
            <ul className="space-y-2">
              {SERVICES.map((sv) => (
                <li key={sv.slug}>
                  <Link
                    to="/hizmetler/$slug"
                    params={{ slug: sv.slug }}
                    className="text-sm text-foreground/75 hover:text-primary transition-colors"
                  >
                    {sv.name}
                  </Link>
                </li>
              ))}
              <li className="pt-1">
                <Link to="/hizmetler" className="text-sm text-primary hover:underline">
                  {t.services.allLink}
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:text-right">
            <h4 className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-4">{t.footer.socialHeader}</h4>
            <a
              href={SITE.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Instagram: ${SITE.social.instagramHandle}`}
              className="inline-flex items-center gap-2 text-sm text-foreground/80 hover:text-primary transition-colors"
            >
              <Instagram className="w-4 h-4" />
              {SITE.social.instagramHandle}
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/40">
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} {t.nav.brand}. {t.footer.copyright}
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-[10px] text-muted-foreground/60">
            <Link to="/kvkk" className="hover:text-primary transition-colors underline underline-offset-2">
              {t.footer.legalLink}
            </Link>
            <span className="hidden sm:inline">·</span>
            <span>{t.footer.disclaimer}</span>
          </div>
          <p className="mt-2 text-[10px] text-muted-foreground/60 text-center max-w-3xl mx-auto leading-relaxed">
            {t.footer.resultDisclaimer}
          </p>
          <p className="mt-6 text-xs text-muted-foreground text-center">
            {t.footer.credit}{" "}
            <a
              href="https://www.trairx.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-foreground/85 hover:text-primary transition-colors"
            >
              TrairX Technology
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
