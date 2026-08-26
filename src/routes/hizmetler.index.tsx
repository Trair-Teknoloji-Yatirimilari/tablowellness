import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowLeft, ArrowUpRight, MessageCircle, Phone } from "lucide-react";
import { SERVICES } from "@/data/services";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SITE, whatsappUrl } from "@/data/site";

const BASE = SITE.url;

const TITLE = `Hizmetler | Fitness, Hyrox, Havuz ve Spa — ${SITE.name}`;
const DESCRIPTION =
  "Fitness, Hyrox ve fonksiyonel antrenman, kişisel antrenman, grup dersleri, yüzme havuzu, spa & masaj, sauna & buhar ve cold plunge. Her başlık ayrıntılı hizmet sayfasına bağlanır.";

export const Route = createFileRoute("/hizmetler/")({
  head: () => {
    const url = `${BASE}/hizmetler`;
    const itemList = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `${SITE.name} Hizmetleri`,
      description: DESCRIPTION,
      url,
      numberOfItems: SERVICES.length,
      itemListElement: SERVICES.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: s.name,
        url: `${BASE}/hizmetler/${s.slug}`,
      })),
    });

    const breadcrumb = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: BASE },
        { "@type": "ListItem", position: 2, name: "Hizmetler", item: url },
      ],
    });

    const collection = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: TITLE,
      description: DESCRIPTION,
      url,
      isPartOf: { "@type": "WebSite", name: SITE.name, url: BASE },
      about: SERVICES.map((s) => ({
        "@type": "Service",
        name: s.name,
        url: `${BASE}/hizmetler/${s.slug}`,
        provider: { "@type": "HealthAndBeautyBusiness", name: SITE.name, url: BASE },
      })),
    });

    return {
      links: [{ rel: "canonical", href: url }],
      meta: [
        { title: TITLE },
        { name: "description", content: DESCRIPTION },
        { property: "og:title", content: TITLE },
        { property: "og:description", content: DESCRIPTION },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      scripts: [
        { type: "application/ld+json", children: collection },
        { type: "application/ld+json", children: itemList },
        { type: "application/ld+json", children: breadcrumb },
      ],
    };
  },
  component: ServicesIndex,
});

function ServicesIndex() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <div className="mx-auto max-w-5xl px-6 lg:px-10 pt-12 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <nav aria-label="breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
            <Link to="/" className="hover:text-primary transition-colors">
              Ana Sayfa
            </Link>
            <span>/</span>
            <span className="text-foreground/70">Hizmetler</span>
          </nav>

          <p className="text-xs uppercase tracking-[0.4em] text-primary mb-4">{SITE.tagline}</p>
          <h1 className="font-display text-4xl md:text-5xl leading-tight">Hizmetlerimiz</h1>
          <p className="mt-6 max-w-2xl text-lg text-foreground/75 leading-relaxed">
            Tesisimizde yer alan antrenman, havuz ve toparlanma hizmetleri. Her başlık;
            hizmetin nasıl yürütüldüğünü, nelere dikkat edilmesi gerektiğini ve sık sorulan
            soruları içeren ayrıntılı bir sayfaya bağlanır.
          </p>

          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {SERVICES.map((sv) => (
              <section
                key={sv.slug}
                className="group flex flex-col overflow-hidden rounded-sm border border-border/50 bg-card/40 transition-colors hover:border-primary/50"
              >
                <Link
                  to="/hizmetler/$slug"
                  params={{ slug: sv.slug }}
                  className="relative block aspect-[4/3] overflow-hidden"
                >
                  <img
                    src={sv.image}
                    alt={sv.name}
                    width={1200}
                    height={900}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                </Link>

                <div className="flex flex-1 flex-col p-6">
                  <h2 className="font-display text-2xl text-gold-gradient">
                    <Link
                      to="/hizmetler/$slug"
                      params={{ slug: sv.slug }}
                      className="transition-opacity hover:opacity-80"
                    >
                      {sv.name}
                    </Link>
                  </h2>
                  <p className="mt-1 text-sm text-foreground/60">{sv.hero}</p>
                  <p className="mt-4 text-sm leading-relaxed text-foreground/70">{sv.intro}</p>
                  <Link
                    to="/hizmetler/$slug"
                    params={{ slug: sv.slug }}
                    className="mt-auto inline-flex items-center gap-2 pt-6 text-sm text-primary hover:underline"
                  >
                    Ayrıntılı bilgi <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </section>
            ))}
          </div>

          <div className="mt-16 border border-primary/25 bg-card/50 rounded-sm p-8 text-center">
            <p className="text-foreground/80">
              Hangi hizmetin size uygun olduğunu ve güncel program bilgisini ekibimizle birlikte belirleyebilirsiniz.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-xs uppercase tracking-widest text-primary-foreground hover:bg-primary/90 transition-all"
              >
                <MessageCircle className="w-4 h-4" strokeWidth={1.6} /> WhatsApp
              </a>
              <a
                href={`tel:${SITE.phone}`}
                className="inline-flex items-center gap-2 rounded-full border border-primary/50 px-7 py-3 text-xs uppercase tracking-widest text-primary hover:bg-primary/10 transition-all"
              >
                <Phone className="w-4 h-4" strokeWidth={1.6} /> {SITE.phoneDisplay}
              </a>
              <a
                href="/#iletisim"
                className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3 text-xs uppercase tracking-widest text-foreground/80 hover:border-primary/60 hover:text-primary transition-all"
              >
                İletişim <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          <Link
            to="/"
            className="mt-12 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Ana sayfaya dön
          </Link>

          <p className="mt-10 text-xs text-foreground/50 leading-relaxed border-t border-border/40 pt-5">
            Bu sayfadaki bilgiler tanıtım amaçlıdır; tıbbi tavsiye veya tedavi yerine geçmez.
            Hizmet kapsamı, alanlar ve program bilgileri zaman içinde güncellenebilir.
          </p>
        </motion.div>
      </div>
      <SiteFooter />
    </div>
  );
}
