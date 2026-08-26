import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowLeft, ArrowUpRight, Check, MessageCircle, Phone } from "lucide-react";
import { getService, SERVICES } from "@/data/services";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SITE, whatsappUrl } from "@/data/site";

const BASE = SITE.url;

export const Route = createFileRoute("/hizmetler/$slug")({
  loader: ({ params }) => {
    const service = getService(params.slug);
    if (!service) throw notFound();
    return service;
  },
  head: ({ loaderData, params }) => {
    const s = loaderData;
    if (!s) return {};
    const url = `${BASE}/hizmetler/${params.slug}`;
    const serviceSchema = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Service",
      name: s.name,
      description: s.seoDescription,
      url,
      areaServed: { "@type": "City", name: "İstanbul" },
      provider: {
        "@type": "HealthAndBeautyBusiness",
        name: SITE.name,
        url: BASE,
        telephone: SITE.phone,
        address: {
          "@type": "PostalAddress",
          streetAddress: [SITE.address.line1, SITE.address.line2].filter(Boolean).join(", "),
          addressLocality: "İstanbul",
          addressRegion: "İstanbul",
          postalCode: SITE.address.postCode,
          addressCountry: "TR",
        },
      },
    });
    const breadcrumb = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: BASE },
        { "@type": "ListItem", position: 2, name: "Hizmetler", item: `${BASE}/hizmetler` },
        { "@type": "ListItem", position: 3, name: s.name, item: url },
      ],
    });
    const faq = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: s.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
    return {
      links: [{ rel: "canonical", href: url }],
      meta: [
        { title: s.seoTitle },
        { name: "description", content: s.seoDescription },
        { property: "og:title", content: s.seoTitle },
        { property: "og:description", content: s.seoDescription },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:image", content: `${BASE}${s.image}` },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      scripts: [
        { type: "application/ld+json", children: serviceSchema },
        { type: "application/ld+json", children: breadcrumb },
        { type: "application/ld+json", children: faq },
      ],
    };
  },
  component: ServicePage,
});

function ServicePage() {
  const s = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <div className="relative h-[38vh] min-h-[280px] w-full overflow-hidden">
        <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      <article className="mx-auto max-w-3xl px-6 lg:px-10 -mt-24 relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <nav aria-label="breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
            <Link to="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
            <span>/</span>
            <span className="text-foreground/70">{s.name}</span>
          </nav>

          <p className="text-xs uppercase tracking-[0.4em] text-primary mb-4">{s.hero}</p>
          <h1 className="font-display text-4xl md:text-5xl leading-tight">{s.name}</h1>
          <p className="mt-6 text-lg text-foreground/80 leading-relaxed">{s.intro}</p>

          {s.sections.map((sec) => (
            <section key={sec.h} className="mt-10">
              <h2 className="font-display text-2xl md:text-3xl text-gold-gradient">{sec.h}</h2>
              {sec.p && <p className="mt-4 text-foreground/75 leading-relaxed">{sec.p}</p>}
              {sec.list && (
                <ul className="mt-4 space-y-2">
                  {sec.list.map((li) => (
                    <li key={li} className="flex items-start gap-3 text-foreground/75">
                      <Check className="w-4 h-4 text-primary mt-1 shrink-0" strokeWidth={1.6} />
                      <span>{li}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <section className="mt-12">
            <h2 className="font-display text-2xl md:text-3xl text-gold-gradient">Sık Sorulan Sorular</h2>
            <div className="mt-5 space-y-5">
              {s.faqs.map((f) => (
                <div key={f.q} className="border-b border-border/50 pb-5">
                  <h3 className="text-foreground/90 font-medium">{f.q}</h3>
                  <p className="mt-2 text-foreground/70 leading-relaxed text-sm">{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="mt-12 border border-primary/25 bg-card/50 rounded-sm p-8 text-center">
            <p className="text-foreground/80">
              Bu hizmet ve güncel program hakkında bilgi almak için bize ulaşabilirsiniz.
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

          <div className="mt-12">
            <p className="text-xs uppercase tracking-[0.35em] text-primary/80 mb-4">İlgili Hizmetler</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {s.related.map((r) => {
                const rel = SERVICES.find((x) => x.slug === r);
                if (!rel) return null;
                return (
                  <Link
                    key={r}
                    to="/hizmetler/$slug"
                    params={{ slug: rel.slug }}
                    className="group border border-border/50 rounded-sm p-5 hover:border-primary/50 transition-colors"
                  >
                    <div className="font-display text-lg group-hover:text-primary transition-colors">{rel.name}</div>
                    <div className="text-xs text-foreground/60 mt-1">{rel.hero}</div>
                  </Link>
                );
              })}
            </div>
          </div>

          <Link to="/" className="mt-12 mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" /> Ana sayfaya dön
          </Link>

          <p className="mb-16 text-xs text-foreground/50 leading-relaxed border-t border-border/40 pt-5">
            Bu sayfadaki bilgiler tanıtım amaçlıdır; tıbbi tavsiye veya tedavi yerine geçmez.
            Hizmet kapsamı, alanlar ve program bilgileri zaman içinde güncellenebilir.
          </p>
        </motion.div>
      </article>
      <SiteFooter />
    </div>
  );
}
