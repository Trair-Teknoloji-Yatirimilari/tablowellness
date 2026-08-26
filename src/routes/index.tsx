import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import { memo, useState } from "react";
import {
  Sparkles,
  Droplets,
  Flame,
  Snowflake,
  Coffee,
  Waves,
  Dumbbell,
  Users,
  HandHeart,
  PersonStanding,
  Activity,
  Phone,
  MessageCircle,
  MapPin,
  Instagram,
  Mail,
  ArrowUpRight,
  ChevronDown,
  Check,
  Clock,
  Timer,
  Repeat,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

import { SiteFooter } from "@/components/SiteFooter";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useT } from "@/i18n/context";
import { tr } from "@/i18n/dictionaries/tr";
import { SERVICES } from "@/data/services";
import { SITE, addressOneLine, mapsUrl, whatsappUrl } from "@/data/site";

/* Tesis medyasi — TAMAMI public/medya/ altindaki gercek dosyalardir.
 * Burada olmayan bir yol yazilmamalidir (404 riski). */
const MEDIA = {
  heroVideo: "/medya/hero.mp4",
  heroPoster: "/medya/hero-poster.webp",
  about: "/medya/tesis-1.webp",
  pool: "/medya/havuz.webp",
} as const;

/** Tesis (galeri) gorselleri — public/medya/tesis-1..5.webp */
const FACILITY_SHOTS = [
  "/medya/tesis-1.webp",
  "/medya/tesis-2.webp",
  "/medya/tesis-3.webp",
  "/medya/tesis-4.webp",
  "/medya/tesis-5.webp",
] as const;

/** Tesis (LocalBusiness) yapisal verisi. Tum iletisim bilgisi SITE'tan gelir.
 *  Calisma saatleri musteriden teyit edilmedigi icin schema'ya eklenmez. */
const BUSINESS_SCHEMA = JSON.stringify({
  "@context": "https://schema.org",
  "@type": ["HealthAndBeautyBusiness", "SportsActivityLocation"],
  name: SITE.name,
  url: SITE.url,
  image: `${SITE.url}${MEDIA.heroPoster}`,
  telephone: SITE.phone,
  email: SITE.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: [SITE.address.line1, SITE.address.line2].filter(Boolean).join(", "),
    addressLocality: "İstanbul",
    addressRegion: "İstanbul",
    postalCode: SITE.address.postCode,
    addressCountry: "TR",
  },
  hasMap: mapsUrl,
  sameAs: [SITE.social.instagram, SITE.social.youtube].filter(Boolean),
  makesOffer: SERVICES.map((s) => ({
    "@type": "Offer",
    itemOffered: { "@type": "Service", name: s.name, url: `${SITE.url}/hizmetler/${s.slug}` },
  })),
});

/** SSS yapisal verisi — sayfada gosterilen sozluk icerigiyle birebir ayni. */
const FAQ_SCHEMA = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: tr.faqSection.items.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});

export const Route = createFileRoute("/")({
  head: () => ({
    links: [{ rel: "canonical", href: `${SITE.url}/` }],
    scripts: [
      { type: "application/ld+json", children: BUSINESS_SCHEMA },
      { type: "application/ld+json", children: FAQ_SCHEMA },
    ],
    meta: [
      { title: tr.meta.home.title },
      { name: "description", content: tr.meta.home.description },
      { property: "og:title", content: tr.meta.home.ogTitle },
      { property: "og:description", content: tr.meta.home.ogDescription },
      { property: "og:url", content: `${SITE.url}/` },
      { property: "og:image", content: `${SITE.url}${MEDIA.heroPoster}` },
    ],
  }),
  component: Index,
});

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
};

/* ---- Icon maps (dictionary carries copy; icons stay client-side) ---- */
/** t.about.milestones ile ayni sirada:
 *  salon, kisisel antrenman, hyrox, grup dersleri, havuz,
 *  dus/soyunma, spa & masaj, sauna & buhar, cold plunge */
const MILESTONE_ICONS = [
  Dumbbell, PersonStanding, Activity, Users, Waves,
  Droplets, HandHeart, Flame, Snowflake, Coffee,
];

/** Tesis alani (t.devices.items) listelerindeki maddelerden hizmet
 *  sayfalarina esleme. Anahtar = sozlukteki key, deger = maddenin dizin
 *  numarasi -> hizmet slug'i. Madde sirasi tum dillerde ayni tutulur.
 *  Hizmet kartlarinin (t.services.items) maddeleri kendi sayfalarina
 *  zaten "Detayli Bilgi" ile baglandigi icin burada yer almaz. */
const ITEM_PAGE_MAP: Record<string, Record<number, string>> = {
  salon: { 0: "fitness", 3: "kisisel-antrenman" },
  fonksiyonel: { 0: "hyrox", 2: "hyrox", 3: "grup-dersleri" },
  "havuz-alani": { 0: "havuz", 1: "havuz" },
  "spa-alani": { 0: "spa-masaj", 1: "sauna", 2: "sauna", 3: "cold-plunge" },
};

/** Sozluk key'i -> /hizmetler/$slug hedefi.
 *  Hizmet key'leri (t.services.items) slug ile birebir aynidir. */
const SERVICE_PAGE_SLUG: Record<string, string> = {
  ...Object.fromEntries(SERVICES.map((sv) => [sv.slug, sv.slug])),
  /* tesis alanlari (t.devices.items) -> en yakin hizmet sayfasi */
  salon: "fitness",
  fonksiyonel: "hyrox",
  "havuz-alani": "havuz",
  "spa-alani": "spa-masaj",
};

const SERVICE_ICONS: Record<string, typeof Sparkles> = {
  fitness: Dumbbell,
  hyrox: Activity,
  "kisisel-antrenman": PersonStanding,
  "grup-dersleri": Users,
  havuz: Waves,
  "spa-masaj": HandHeart,
  sauna: Flame,
  "cold-plunge": Snowflake,
};

/** Hizmet gorselleri dogrudan katalogdan gelir (public/medya/<slug>.webp). */
const SERVICE_IMAGES: Record<string, string> = Object.fromEntries(
  SERVICES.map((sv) => [sv.slug, sv.image]),
);

const DEVICE_ICONS: Record<string, typeof Sparkles> = {
  salon: Dumbbell,
  fonksiyonel: Activity,
  "havuz-alani": Waves,
  "spa-alani": Sparkles,
};

const DEVICE_IMAGES: Record<string, string> = {
  salon: "/medya/tesis-2.webp",
  fonksiyonel: "/medya/tesis-3.webp",
  "havuz-alani": "/medya/tesis-4.webp",
  "spa-alani": "/medya/tesis-5.webp",
};

function Index() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <Nav />
      <Hero />
      <HeroCta />
      <Marquee />
      <AreaSpotlight />
      <About />
      <Clinic />
      <Philosophy />
      <Services />
      <Devices />
      <Gallery />
      <Faq />
      <Contact />
      <SiteFooter />
    </div>
  );
}

/* ---------------- NAV ---------------- */

function Nav() {
  const [open, setOpen] = useState(false);
  const { t } = useT();
  const links: { href: string; label: string; route?: boolean }[] = [
    { href: "#hakkinda", label: t.nav.about },
    { href: "#klinik", label: t.nav.clinic },
    { href: "#uygulamalar", label: t.nav.services },
    { href: "#alanlar", label: t.nav.devices },
    { href: "#galeri", label: t.nav.journey },
    { href: "#sss", label: t.nav.faq },
    { href: "#iletisim", label: t.nav.contact },
  ];

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 backdrop-blur-xl bg-background/60 border-b border-border/40"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10 flex items-center justify-between h-16 md:h-20">
        <a href="#top" className="flex flex-col justify-center leading-tight group">
          <span className="text-gold-gradient font-display text-base md:text-lg tracking-wide whitespace-nowrap">
            {t.nav.brand}
          </span>
          <span className="text-[8px] md:text-[9px] uppercase tracking-[0.35em] text-muted-foreground mt-0.5">
            {t.nav.tagline}
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) =>
            l.route ? (
              <Link key={l.href} to={l.href} className="text-sm text-foreground/80 hover:text-primary transition-colors relative group">
                {l.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-500 group-hover:w-full" />
              </Link>
            ) : (
              <a key={l.href} href={l.href} className="text-sm text-foreground/80 hover:text-primary transition-colors relative group">
                {l.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-500 group-hover:w-full" />
              </a>
            ),
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <LanguageSwitcher />
          <a href="#iletisim" className="inline-flex items-center gap-2 rounded-full border border-primary/60 px-5 py-2 text-xs uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-500">
            {t.nav.ctaAppointment} <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
        <div className="md:hidden flex items-center gap-2">
          <LanguageSwitcher />
          <button onClick={() => setOpen(!open)} className="text-primary p-2" aria-label={t.nav.menuAria}>
            <div className="w-6 h-px bg-current mb-1.5" />
            <div className="w-6 h-px bg-current mb-1.5" />
            <div className="w-4 h-px bg-current ml-auto" />
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-border/40 bg-background/95">
          <div className="px-6 py-4 flex flex-col gap-4">
            {links.map((l) =>
              l.route ? (
                <Link key={l.href} to={l.href} onClick={() => setOpen(false)} className="text-sm text-foreground/80">{l.label}</Link>
              ) : (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-sm text-foreground/80">{l.label}</a>
              ),
            )}
          </div>
        </div>
      )}
    </motion.header>
  );
}

/* ---------------- HERO ---------------- */

/**
 * Ana slider kaldirildi: hero artik tek bir tam genislikte video alani.
 * Video sessiz ve dekoratiftir (aria-hidden); baslik metni ayrica DOM'da
 * bulunur. prefers-reduced-motion tercihi olan kullaniciya video hic
 * basilmaz, yalnizca poster gorseli gosterilir.
 */
function Hero() {
  const { t } = useT();
  const reduced = useReducedMotion();

  return (
    <section
      id="top"
      className="relative w-full h-[78vh] min-h-[520px] md:h-[88vh] md:min-h-[640px] overflow-hidden bg-background"
    >
      <div className="absolute inset-0">
        <img
          src={MEDIA.heroPoster}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {!reduced && (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={MEDIA.heroPoster}
            aria-hidden="true"
            tabIndex={-1}
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src={MEDIA.heroVideo} type="video/mp4" />
          </video>
        )}

        {/* Okunabilirlik icin koyu degrade overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/40 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-16 pt-24 md:pb-24 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <span className="inline-flex items-center rounded-full border border-primary/50 bg-background/50 px-4 py-1.5 text-[10px] uppercase tracking-[0.3em] text-primary backdrop-blur">
            {t.hero.badge}
          </span>

          <h1 className="mt-6 font-display text-5xl leading-[0.95] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            <span dir="ltr" style={{ unicodeBidi: "isolate" }}>{t.hero.firstName}</span>
            <br />
            <span className="text-gold-gradient">{t.hero.lastName}</span>
          </h1>

          <p className="mt-6 max-w-xl text-sm leading-relaxed text-foreground/85 md:text-base">
            {t.hero.subtitle}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#iletisim"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs uppercase tracking-widest text-primary-foreground transition-all hover:bg-primary/90 glow-gold"
            >
              {t.hero.ctaConsult}
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <a
              href="#uygulamalar"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-6 py-3 text-xs uppercase tracking-widest text-foreground/85 backdrop-blur transition-all hover:border-primary/60 hover:text-primary"
            >
              {t.hero.ctaServices}
            </a>
          </div>
        </motion.div>
      </div>

      <a
        href="#hakkinda"
        className="absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-foreground/60 transition-colors hover:text-primary md:inline-flex"
      >
        {t.hero.discover}
        <ChevronDown className="w-3.5 h-3.5" />
      </a>
    </section>
  );
}

function HeroCta() {
  const { t } = useT();
  return (
    <section className="relative z-20 -mt-8 pb-8 md:-mt-12 md:pb-12 pointer-events-none">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="pointer-events-auto flex flex-col sm:flex-row items-center justify-between gap-6 bg-card/80 backdrop-blur-xl border border-primary/30 rounded-sm px-6 py-6 md:px-10 md:py-8 shadow-elegant"
        >
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
              <div className="h-px w-8 bg-primary/60" />
              <span className="text-[10px] uppercase tracking-[0.35em] text-primary/80">{t.nav.ctaAppointment}</span>
            </div>
            <p className="text-foreground/80 text-sm md:text-base max-w-md leading-relaxed">
              {t.hero.appointmentCtaDesc}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <a
              href={`tel:${SITE.phone}`}
              className="group inline-flex items-center gap-3 rounded-full bg-primary px-7 py-3.5 text-sm uppercase tracking-widest text-primary-foreground hover:bg-primary/90 transition-all glow-gold"
            >
              <Phone className="w-4 h-4" strokeWidth={1.6} />
              {SITE.phoneDisplay}
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-primary/50 px-6 py-3.5 text-xs uppercase tracking-widest text-primary hover:bg-primary/10 transition-all"
            >
              <MessageCircle className="w-4 h-4" strokeWidth={1.6} />
              WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- MARQUEE ---------------- */

function Marquee() {
  const { t } = useT();
  const items = t.marquee;
  return (
    <div className="border-y border-border/40 bg-card/40 backdrop-blur overflow-hidden py-6">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...items, ...items, ...items].map((it, i) => (
          <div key={i} className="flex items-center gap-8 px-8">
            <span className="font-display text-2xl md:text-3xl text-foreground/60">{it}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- ABOUT / BIOGRAPHY ---------------- */

function About() {
  const { t } = useT();
  return (
    <section id="hakkinda" className="relative py-24 md:py-40 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-primary/8 blur-[160px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          <motion.div {...fadeUp} className="lg:col-span-5 relative lg:sticky lg:top-28">
            <div className="relative aspect-square overflow-hidden rounded-sm">
              <img src={MEDIA.about} alt={t.about.portraitAlt} className="w-full h-full object-cover" width={447} height={447} loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
            </div>
          </motion.div>

          <motion.div {...fadeUp} className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-10 bg-primary" />
              <span className="text-xs uppercase tracking-[0.4em] text-primary">{t.about.badge}</span>
            </div>
            <h2 className="font-display text-4xl md:text-6xl leading-tight">
              {t.about.firstName}
              <br />
              <span className="text-gold-gradient">{t.about.lastName}</span>
            </h2>
            <div className="hairline my-8 max-w-md" />

            {t.about.paragraphs.map((p, i) => (
              <p
                key={i}
                className={i === 0 ? "text-foreground/80 leading-relaxed text-lg" : "text-foreground/75 leading-relaxed mt-4"}
              >
                {p}
              </p>
            ))}

          </motion.div>
        </div>

        {/* Tesis alanları — sözlükteki milestones listesinden */}
        <motion.div {...fadeUp} className="mt-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-10 bg-primary" />
            <span className="text-xs uppercase tracking-[0.4em] text-primary">{t.about.careerBadge}</span>
          </div>
          <h3 className="font-display text-3xl md:text-4xl leading-tight">
            {t.about.careerTitleA} <span className="text-gold-gradient">{t.about.careerTitleB}</span>
          </h3>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {t.about.milestones.map((m, i) => {
              const Icon = MILESTONE_ICONS[i % MILESTONE_ICONS.length];
              return (
                <div
                  key={`${m.year}-${m.title}`}
                  className="group border border-border/60 bg-card/40 rounded-sm p-6 hover:border-primary/50 transition-colors duration-500"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-6 h-6 text-primary" strokeWidth={1.2} />
                    <span className="text-[10px] uppercase tracking-[0.35em] text-primary/80">{m.year}</span>
                  </div>
                  <div className="font-display text-xl mt-4 group-hover:text-primary transition-colors">{m.title}</div>
                  <p className="text-sm text-foreground/70 leading-relaxed mt-2">{m.desc}</p>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div {...fadeUp} className="mt-24 border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent rounded-sm p-8 md:p-12 text-center">
          <h4 className="font-display text-2xl md:text-3xl text-foreground/90">
            {t.about.quote}
          </h4>
          <p className="mt-4 text-foreground/60 text-sm max-w-2xl mx-auto">
            {t.about.quoteDesc}
          </p>
        </motion.div>
      </div>
    </section>
  );
}


/* ---------------- ÖNE ÇIKAN ALAN (HAVUZ) ---------------- */

function AreaSpotlight() {
  const { t } = useT();
  const device = t.devices.items.find((d) => d.key === "havuz-alani");
  if (!device) return null;
  return (
    <section className="relative py-16 md:py-24 bg-card/40 border-y border-primary/20 overflow-hidden">
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[140px] pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center md:justify-end"
          >
            <img
              src={MEDIA.pool}
              alt={device.name}
              className="w-full max-h-[420px] md:max-h-[520px] rounded-sm object-cover shadow-2xl"
              loading="lazy"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-block rounded-full border border-primary/50 bg-primary/10 px-4 py-1.5 text-[10px] uppercase tracking-[0.3em] text-primary">
              {device.tag}
            </span>
            <h2 className="mt-5 font-display text-4xl md:text-5xl leading-tight">
              <span className="text-gold-gradient">{device.name}</span>
            </h2>
            <p className="mt-5 text-foreground/75 leading-relaxed max-w-lg">{device.desc}</p>

            <ul className="mt-7 space-y-3">
              {device.benefits.slice(0, 3).map((b) => (
                <li key={b} className="flex items-start gap-3 text-foreground/85">
                  <Check className="w-4 h-4 text-primary mt-1 shrink-0" strokeWidth={1.6} />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/hizmetler/$slug"
                params={{ slug: "havuz" }}
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-xs uppercase tracking-widest text-primary-foreground hover:bg-primary/90 transition-all glow-gold"
              >
                {t.detailLabels.moreInfo} <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <a
                href="#iletisim"
                className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3 text-xs uppercase tracking-widest text-foreground/80 hover:border-primary/60 hover:text-primary transition-all"
              >
                {t.hero.ctaConsult}
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- CLINIC ---------------- */

const clinicPhotos = [
  ...FACILITY_SHOTS,
];

function Clinic() {
  const { t } = useT();
  return (
    <section id="klinik" className="relative py-24 md:py-40 bg-card/30 border-y border-border/40 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1 }}
          className="max-w-2xl"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-12 bg-primary" />
            <span className="text-xs uppercase tracking-[0.4em] text-primary">{t.clinic.badge}</span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl leading-tight">{t.clinic.title}</h2>
          <p className="mt-6 text-foreground/70 leading-relaxed">{t.clinic.desc}</p>
        </motion.div>

        <div className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {clinicPhotos.map((src, i) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.8, delay: i * 0.08 }}
              className={`overflow-hidden rounded-sm border border-border/50 ${i === 0 ? "col-span-2 row-span-2" : ""}`}
            >
              <img
                src={src}
                alt={t.clinic.galleryAlt}
                loading="lazy"
                className="w-full h-full object-cover aspect-[4/3] hover:scale-105 transition-transform duration-700"
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1 }}
          className="mt-12 md:mt-16 flex flex-wrap items-center gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="h-px w-12 bg-primary" />
            <span className="text-xs uppercase tracking-[0.4em] text-primary">{t.clinic.videoTitle}</span>
          </div>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-primary/50 px-6 py-2.5 text-xs uppercase tracking-widest text-primary hover:bg-primary/10 transition-all"
          >
            <MapPin className="w-3.5 h-3.5" strokeWidth={1.6} />
            {t.contact.cards.clinic}
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- PHILOSOPHY ---------------- */

function Philosophy() {
  const { t } = useT();
  return (
    <section className="relative py-32 md:py-48 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-primary/10 blur-[140px] animate-pulse-glow" />
      </div>
      <div className="relative mx-auto max-w-5xl px-6 text-center">
        {t.philosophy.map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.25, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className={`font-display text-3xl md:text-5xl lg:text-6xl leading-tight ${
              i === 1 ? "text-gold-gradient my-6" : "text-foreground/90"
            }`}
          >
            {line}
          </motion.p>
        ))}
      </div>
    </section>
  );
}

/* ---------------- SHARED DETAIL DIALOG ---------------- */

type Detail = {
  pitch: string;
  benefits: string[];
  duration: string;
  effect: string;
  interval: string;
  closing: string;
  faqs: { q: string; a: string }[];
};

const DetailDialog = memo(function DetailDialog({
  open, onOpenChange, title, subtitle, image, items, detail,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  subtitle: string;
  image: string;
  items: string[];
  detail: Detail;
}) {
  const { t } = useT();
  const L = t.detailLabels;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95vw] p-0 bg-background border border-primary/30 overflow-hidden max-h-[92vh] overflow-y-auto">
        <div className="grid md:grid-cols-2">
          <div className="relative aspect-[4/5] md:aspect-auto md:min-h-full overflow-hidden">
            <img src={image} alt={title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-background/40" />
          </div>
          <div className="p-8 md:p-10">
            <DialogHeader className="text-left space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-px w-8 bg-primary" />
                <span className="text-[10px] uppercase tracking-[0.4em] text-primary">{L.detail}</span>
              </div>
              <DialogTitle className="font-display text-3xl md:text-4xl font-normal">{title}</DialogTitle>
              <DialogDescription className="text-primary/90 font-display text-lg tracking-wide">{subtitle}</DialogDescription>
            </DialogHeader>

            <p className="mt-5 text-foreground/80 leading-relaxed text-sm">{detail.pitch}</p>

            <div className="mt-6 space-y-2">
              {detail.benefits.map((b) => (
                <div key={b} className="flex items-start gap-2.5 text-sm text-foreground/85">
                  <Check className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" strokeWidth={1.5} />
                  <span>{b}</span>
                </div>
              ))}
            </div>

            <div className="hairline my-6" />

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div>
                <Clock className="w-4 h-4 text-primary mb-1.5" strokeWidth={1.2} />
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{L.duration}</div>
                <div className="text-foreground/90 mt-1">{detail.duration}</div>
              </div>
              <div>
                <Timer className="w-4 h-4 text-primary mb-1.5" strokeWidth={1.2} />
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{L.effect}</div>
                <div className="text-foreground/90 mt-1">{detail.effect}</div>
              </div>
              <div>
                <Repeat className="w-4 h-4 text-primary mb-1.5" strokeWidth={1.2} />
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{L.interval}</div>
                <div className="text-foreground/90 mt-1">{detail.interval}</div>
              </div>
            </div>

            <div className="hairline my-6" />

            <div>
              <div className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-3">{L.areas}</div>
              <div className="flex flex-wrap gap-1.5">
                {items.map((it) => (
                  <span key={it} className="text-[11px] px-2.5 py-1 rounded-full border border-border bg-card/50 text-foreground/75">
                    {it}
                  </span>
                ))}
              </div>
            </div>

            <p className="mt-6 text-sm text-foreground/70 italic border-l-2 border-primary/60 pl-4">{detail.closing}</p>

            {detail.faqs?.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px w-8 bg-primary" />
                  <span className="text-[10px] uppercase tracking-[0.4em] text-primary">{L.faqSection}</span>
                </div>
                <Accordion type="single" collapsible className="w-full">
                  {detail.faqs.map((f, idx) => (
                    <AccordionItem key={f.q} value={`faq-${idx}`} className="border-b border-border/60">
                      <AccordionTrigger className="text-left text-sm font-normal text-foreground/90 hover:text-primary hover:no-underline py-3">
                        {f.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-foreground/70 leading-relaxed pb-4">
                        {f.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}

            <div className="mt-7 flex items-center gap-3">
              <a
                href="#iletisim"
                onClick={() => onOpenChange(false)}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs uppercase tracking-widest text-primary-foreground hover:bg-primary/90 transition-all glow-gold"
              >
                {L.appointmentCta} <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <ShieldCheck className="w-3.5 h-3.5 text-primary/70" strokeWidth={1.5} />
                {L.doctorSupervised}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

/* ---------------- SERVICES ---------------- */

function Services() {
  const { t } = useT();
  return (
    <section id="uygulamalar" className="relative py-24 md:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div {...fadeUp} className="max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-10 bg-primary" />
            <span className="text-xs uppercase tracking-[0.4em] text-primary">{t.services.badge}</span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl leading-tight">
            {t.services.titleA} <span className="text-gold-gradient">{t.services.titleB}</span>
          </h2>
          <p className="mt-6 text-foreground/70 text-lg leading-relaxed">{t.services.intro}</p>
          <Link
            to="/hizmetler"
            className="mt-7 inline-flex items-center gap-2 rounded-full border border-primary/40 px-6 py-3 text-xs uppercase tracking-widest text-primary hover:bg-primary/10 transition-all"
          >
            {t.services.allLink} <ArrowUpRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="mt-16 space-y-24">
          {t.services.items.map((s, i) => (
            <ServiceRow key={s.key} service={s} reversed={i % 2 === 1} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

type ServiceItem = ReturnType<typeof useT>["t"]["services"]["items"][number];

function ServiceRow({ service, reversed, index }: { service: ServiceItem; reversed: boolean; index: number }) {
  const { t } = useT();
  const Icon = SERVICE_ICONS[service.key] ?? DEVICE_ICONS[service.key] ?? Sparkles;
  const image = SERVICE_IMAGES[service.key] ?? DEVICE_IMAGES[service.key] ?? MEDIA.heroPoster;
  const [open, setOpen] = useState(false);
  const detail: Detail = {
    pitch: service.pitch,
    benefits: service.benefits,
    duration: service.duration,
    effect: service.effect,
    interval: service.interval,
    closing: service.closing,
    faqs: service.faqs,
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className={`grid lg:grid-cols-12 gap-8 lg:gap-16 items-center ${reversed ? "lg:[&>div:first-child]:order-2" : ""}`}
    >
      <div className="lg:col-span-6 relative group">
        <div className="relative aspect-[5/4] overflow-hidden rounded-sm">
          <motion.img
            src={image}
            alt={service.title}
            className="w-full h-full object-cover"
            width={1200}
            height={1200}
            loading="lazy"
            initial={{ scale: 1.15 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/35 via-transparent to-transparent" />
          <div className="absolute top-6 left-6 flex items-center gap-2 text-primary/80">
            <span className="font-display text-sm">0{index + 1}</span>
            <div className="h-px w-8 bg-primary/60" />
          </div>
        </div>
      </div>
      <div className="lg:col-span-6">
        <Icon className="w-10 h-10 text-primary mb-6" strokeWidth={1} />
        <h3 className="font-display text-4xl md:text-5xl">{service.title}</h3>
        <p className="mt-3 text-primary/90 font-display text-xl tracking-wide">{service.subtitle}</p>
        <div className="hairline my-8 max-w-xs" />
        <ul className="grid sm:grid-cols-2 gap-3">
          {service.items.map((it, itemIndex) => {
            const pageSlug = ITEM_PAGE_MAP[service.key]?.[itemIndex];
            return (
              <li key={it} className="flex items-start gap-3 text-foreground/80 text-sm">
                <Check className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" strokeWidth={1.5} />
                {pageSlug ? (
                  <Link
                    to="/hizmetler/$slug"
                    params={{ slug: pageSlug }}
                    className="group/item inline-flex items-center gap-1 text-foreground/85 hover:text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary transition-colors"
                  >
                    {it}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                  </Link>
                ) : (
                  <span>{it}</span>
                )}
              </li>
            );
          })}
        </ul>
        <button
          onClick={() => setOpen(true)}
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-primary/60 px-6 py-2.5 text-xs uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-500"
        >
          {t.detailLabels.seeDetails} <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
        {SERVICE_PAGE_SLUG[service.key] && (
          <Link
            to="/hizmetler/$slug"
            params={{ slug: SERVICE_PAGE_SLUG[service.key] }}
            className="mt-8 ml-3 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs uppercase tracking-widest text-primary-foreground hover:bg-primary/90 transition-all"
          >
            {t.detailLabels.moreInfo} <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
      {open && (
        <DetailDialog
          open={open}
          onOpenChange={setOpen}
          title={service.title}
          subtitle={service.subtitle}
          image={image}
          items={service.items}
          detail={detail}
        />
      )}
    </motion.div>
  );
}

/* ---------------- TESIS ALANLARI ---------------- */

function Devices() {
  const { t } = useT();
  return (
    <section id="alanlar" className="relative py-24 md:py-40 bg-card/30 border-y border-border/40 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-primary/8 blur-[160px] pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div {...fadeUp} className="max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-10 bg-primary" />
            <span className="text-xs uppercase tracking-[0.4em] text-primary">{t.devices.badge}</span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl leading-tight">
            {t.devices.titleA} <span className="text-gold-gradient">{t.devices.titleB}</span>
          </h2>
        </motion.div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {t.devices.items.map((d, i) => (
            <DeviceCard key={d.key} device={d} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

type DeviceItem = ReturnType<typeof useT>["t"]["devices"]["items"][number];

function DeviceCard({ device, index }: { device: DeviceItem; index: number }) {
  const { t } = useT();
  const Icon = DEVICE_ICONS[device.key] ?? Sparkles;
  const image = DEVICE_IMAGES[device.key] ?? MEDIA.about;
  const pageSlug = SERVICE_PAGE_SLUG[device.key];
  const [open, setOpen] = useState(false);
  const detail: Detail = {
    pitch: device.pitch,
    benefits: device.benefits,
    duration: device.duration,
    effect: device.effect,
    interval: device.interval,
    closing: device.closing,
    faqs: device.faqs,
  };
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay: (index % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col border border-border/60 bg-card/50 rounded-sm overflow-hidden hover:border-primary/50 transition-colors duration-500"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={device.name}
          width={1200}
          height={900}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        <Icon className="absolute bottom-4 left-5 w-8 h-8 text-primary" strokeWidth={1.1} />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <span className="text-[10px] uppercase tracking-[0.3em] text-primary/80">{device.tag}</span>
        <h3 className="mt-3 font-display text-2xl leading-tight group-hover:text-primary transition-colors">
          {device.name}
        </h3>
        <p className="mt-3 text-sm text-foreground/70 leading-relaxed">{device.desc}</p>

        <ul className="mt-5 space-y-2">
          {device.items.slice(0, 4).map((it, itemIndex) => {
            const itemSlug = ITEM_PAGE_MAP[device.key]?.[itemIndex];
            return (
              <li key={it} className="flex items-start gap-2.5 text-sm text-foreground/80">
                <Check className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" strokeWidth={1.5} />
                {itemSlug ? (
                  <Link
                    to="/hizmetler/$slug"
                    params={{ slug: itemSlug }}
                    className="underline decoration-primary/30 underline-offset-4 hover:text-primary hover:decoration-primary transition-colors"
                  >
                    {it}
                  </Link>
                ) : (
                  <span>{it}</span>
                )}
              </li>
            );
          })}
        </ul>

        <div className="mt-auto flex flex-wrap items-center gap-3 pt-6">
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-primary/60 px-5 py-2 text-[10px] uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-500"
          >
            {t.detailLabels.seeDetails} <ArrowUpRight className="w-3 h-3" />
          </button>
          {pageSlug && (
            <Link
              to="/hizmetler/$slug"
              params={{ slug: pageSlug }}
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-foreground/70 hover:text-primary transition-colors"
            >
              {t.detailLabels.moreInfo} <ArrowUpRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>

      {open && (
        <DetailDialog
          open={open}
          onOpenChange={setOpen}
          title={device.name}
          subtitle={device.tag}
          image={image}
          items={device.items}
          detail={detail}
        />
      )}
    </motion.article>
  );
}

/* ---------------- JOURNEY ---------------- */

function Gallery() {
  const { t } = useT();
  const shots = [
    "/medya/tesis-1.webp",
    "/medya/fitness.webp",
    "/medya/hyrox.webp",
    "/medya/grup-dersleri.webp",
    "/medya/havuz.webp",
    "/medya/tesis-3.webp",
    "/medya/spa-masaj.webp",
    "/medya/cold-plunge.webp",
  ];
  return (
    <section id="galeri" className="relative py-24 md:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div {...fadeUp} className="max-w-3xl mb-14">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-10 bg-primary" />
            <span className="text-xs uppercase tracking-[0.4em] text-primary">{t.journey.badge}</span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl leading-tight">
            {t.journey.titleA} <span className="text-gold-gradient">{t.journey.titleB}</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {shots.map((src, i) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: (i % 4) * 0.08 }}
              className={`overflow-hidden rounded-sm border border-border/50 ${i === 0 || i === 5 ? "col-span-2 row-span-2" : ""}`}
            >
              <img
                src={src}
                alt={t.clinic.galleryAlt}
                loading="lazy"
                className="w-full h-full object-cover aspect-square hover:scale-105 transition-transform duration-700"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- CONTACT ---------------- */

function Contact() {
  const { t } = useT();
  const cards = [
    { icon: Phone, label: t.contact.cards.phone, value: SITE.phoneDisplay, href: `tel:${SITE.phone}` },
    { icon: MessageCircle, label: "WhatsApp", value: SITE.phoneDisplay, href: whatsappUrl },
    { icon: Mail, label: t.contact.cards.email, value: SITE.email, href: `mailto:${SITE.email}` },
    {
      icon: MapPin,
      label: t.contact.cards.clinic,
      value: t.contact.address || addressOneLine,
      href: mapsUrl,
    },
    {
      icon: Instagram,
      label: t.contact.cards.instagram,
      value: SITE.social.instagramHandle,
      href: SITE.social.instagram,
    },
  ];
  return (
    <section id="iletisim" className="relative py-24 md:py-40 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-primary/15 blur-[130px] animate-pulse-glow" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 lg:px-10">
        <motion.div {...fadeUp} className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-10 bg-primary" />
            <span className="text-xs uppercase tracking-[0.4em] text-primary">{t.contact.badge}</span>
            <div className="h-px w-10 bg-primary" />
          </div>
          <h2 className="font-display text-4xl md:text-6xl leading-tight">
            {t.contact.titleA} <span className="text-gold-gradient">{t.contact.titleB}</span> {t.contact.titleC}
          </h2>
          <p className="mt-6 text-foreground/70 max-w-2xl mx-auto">{t.contact.intro}</p>
        </motion.div>

        <motion.div {...fadeUp} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group relative bg-card/60 backdrop-blur border border-border/60 hover:border-primary/60 rounded-sm p-8 transition-all duration-500"
            >
              <c.icon className="w-8 h-8 text-primary mb-6" strokeWidth={1} />
              <div className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground">{c.label}</div>
              <div className={`font-display leading-snug mt-2 text-foreground/90 group-hover:text-primary transition-colors break-words ${c.value.length > 22 ? "text-[13px] tracking-tight" : "text-[15px] md:text-base"}`}>
                {c.value}
              </div>
              <ArrowUpRight className="absolute top-6 right-6 w-4 h-4 text-primary/50 group-hover:text-primary group-hover:-translate-y-1 group-hover:translate-x-1 transition-all" />
            </a>
          ))}
        </motion.div>

        {/* Randevu formu kaldirildi: iletisim dogrudan telefon / WhatsApp
            / e-posta uzerinden yurutulur. */}
        <motion.div
          {...fadeUp}
          className="mt-16 max-w-3xl mx-auto border border-primary/25 bg-card/50 rounded-sm px-6 py-10 md:px-10 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-primary/60" />
            <span className="text-[10px] uppercase tracking-[0.4em] text-primary/80">{t.contact.formBadge}</span>
            <div className="h-px w-8 bg-primary/60" />
          </div>
          <h3 className="font-display text-2xl md:text-3xl text-foreground">
            {t.contact.formTitleA} <span className="text-gold-gradient">{t.contact.formTitleB}</span>
          </h3>

          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-xs uppercase tracking-widest text-primary-foreground hover:bg-primary/90 transition-all glow-gold"
            >
              <MessageCircle className="w-4 h-4" strokeWidth={1.6} />
              WhatsApp
            </a>
            <a
              href={`tel:${SITE.phone}`}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/50 px-7 py-3.5 text-xs uppercase tracking-widest text-primary hover:bg-primary/10 transition-all"
            >
              <Phone className="w-4 h-4" strokeWidth={1.6} />
              {SITE.phoneDisplay}
            </a>
            <a
              href={`mailto:${SITE.email}`}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-7 py-3.5 text-xs uppercase tracking-widest text-foreground/80 hover:border-primary/60 hover:text-primary transition-all"
            >
              <Mail className="w-4 h-4" strokeWidth={1.6} />
              {t.contact.cards.email}
            </a>
          </div>

          <p className="mt-7 text-sm text-foreground/70 leading-relaxed">{t.form.footer}</p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-foreground/75 hover:text-primary transition-colors"
            >
              <MapPin className="w-4 h-4 text-primary" strokeWidth={1.5} />
              {t.contact.address || addressOneLine}
            </a>
            <a
              href={SITE.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-foreground/75 hover:text-primary transition-colors"
            >
              <Instagram className="w-4 h-4 text-primary" strokeWidth={1.5} />
              {SITE.social.instagramHandle}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */

function Faq() {
  const { t } = useT();
  return (
    <section id="sss" className="relative py-24 md:py-40 bg-card/30 border-y border-border/40 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-primary/8 blur-[160px] pointer-events-none" />
      <div className="relative mx-auto max-w-4xl px-6 lg:px-10">
        <motion.div {...fadeUp} className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-10 bg-primary" />
            <span className="text-xs uppercase tracking-[0.4em] text-primary">{t.faqSection.badge}</span>
            <div className="h-px w-10 bg-primary" />
          </div>
          <h2 className="font-display text-4xl md:text-6xl leading-tight">
            {t.faqSection.titleA} <span className="text-gold-gradient">{t.faqSection.titleB}</span>
          </h2>
          <p className="mt-6 text-foreground/70 max-w-2xl mx-auto">{t.faqSection.intro}</p>
        </motion.div>

        <motion.div {...fadeUp}>
          <Accordion type="single" collapsible className="w-full">
            {t.faqSection.items.map((f, idx) => (
              <AccordionItem key={f.q} value={`faq-${idx}`} className="border-b border-border/60">
                <AccordionTrigger className="text-left text-base font-normal text-foreground/90 hover:text-primary hover:no-underline py-5">
                  <span className="flex items-start gap-4">
                    <HelpCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" strokeWidth={1.2} />
                    {f.q}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-foreground/70 leading-relaxed pb-5 pl-9">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        <motion.div {...fadeUp} className="mt-12 text-center">
          <a href="#iletisim" className="inline-flex items-center gap-2 rounded-full border border-primary/60 px-6 py-2.5 text-xs uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-500">
            {t.faqSection.cta} <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- FOOTER ---------------- */

