import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { type ReactNode } from "react";

import appCss from "../styles.css?url";
import { LocaleProvider, useT } from "@/i18n/context";
import { tr } from "@/i18n/dictionaries/tr";
import { SITE, whatsappUrl } from "@/data/site";

function NotFoundComponent() {
  const { t } = useT();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-display text-gold-gradient">404</h1>
        <h2 className="mt-4 text-xl font-display text-foreground">{t.notFound.title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t.notFound.body}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-xs uppercase tracking-widest text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t.notFound.cta}
          </Link>
          <Link
            to="/hizmetler"
            className="inline-flex items-center justify-center rounded-full border border-border px-6 py-2.5 text-xs uppercase tracking-widest text-foreground/80 transition-colors hover:border-primary/60 hover:text-primary"
          >
            {t.nav.services}
          </Link>
          <a
            href="/#iletisim"
            className="inline-flex items-center justify-center rounded-full border border-border px-6 py-2.5 text-xs uppercase tracking-widest text-foreground/80 transition-colors hover:border-primary/60 hover:text-primary"
          >
            {t.nav.contact}
          </a>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  const { t } = useT();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-display text-foreground">{t.errorBoundary.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t.errorBoundary.body}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            {t.errorBoundary.retry}
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
          >
            {t.errorBoundary.home}
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: tr.meta.home.title },
      { name: "description", content: tr.meta.home.description },
      { name: "author", content: SITE.name },
      { property: "og:site_name", content: SITE.name },
      { property: "og:title", content: tr.meta.home.ogTitle },
      { property: "og:description", content: tr.meta.home.ogDescription },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE.url}/` },
      { property: "og:image", content: `${SITE.url}/medya/og.png` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico?v=2", type: "image/x-icon" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "alternate", hrefLang: "tr", href: `${SITE.url}/` },
      { rel: "alternate", hrefLang: "en", href: `${SITE.url}/?lang=en` },
      { rel: "alternate", hrefLang: "x-default", href: `${SITE.url}/` },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Inter:wght@300;400;500;600&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

/** Google Analytics. Build sirasinda VITE_GA_ID verilmezse SITE.gaId'ye duser;
 *  ikisi de bossa gtag script'i hic yuklenmez. */
const GA_ID =
  ((import.meta as { env?: Record<string, string> }).env?.VITE_GA_ID ?? "").trim() || SITE.gaId;

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="tr" dir="ltr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        {GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`,
              }}
            />
          </>
        )}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <LocaleProvider>
        <Outlet />
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`WhatsApp: ${SITE.phoneDisplay}`}
          className="fixed bottom-5 right-5 md:bottom-7 md:right-7 z-50 w-14 h-14 rounded-full bg-[#25D366] shadow-lg shadow-black/20 flex items-center justify-center hover:scale-110 transition-transform duration-300"
        >
          <svg viewBox="0 0 32 32" className="w-7 h-7 fill-white" aria-hidden="true">
            <path d="M16.004 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.257.59 4.462 1.712 6.406L3.2 28.8l6.56-1.683a12.74 12.74 0 0 0 6.24 1.63h.005c7.059 0 12.795-5.74 12.795-12.8 0-3.42-1.33-6.633-3.748-9.05a12.72 12.72 0 0 0-9.048-3.697zm0 23.386h-.004a10.6 10.6 0 0 1-5.404-1.48l-.388-.23-3.893.999 1.04-3.795-.253-.39a10.57 10.57 0 0 1-1.622-5.69c0-5.867 4.774-10.64 10.646-10.64 2.843 0 5.515 1.108 7.524 3.119a10.58 10.58 0 0 1 3.115 7.526c-.003 5.867-4.777 10.64-10.64 10.64zm5.837-7.968c-.32-.16-1.893-.934-2.187-1.041-.293-.107-.507-.16-.72.16-.213.32-.826 1.04-1.013 1.254-.187.213-.373.24-.693.08-.32-.16-1.352-.498-2.575-1.589-.952-.849-1.594-1.897-1.781-2.217-.187-.32-.02-.494.14-.653.144-.143.32-.373.48-.56.16-.187.213-.32.32-.534.107-.213.054-.4-.026-.56-.08-.16-.72-1.736-.987-2.376-.26-.624-.523-.54-.72-.55-.186-.008-.4-.01-.613-.01-.213 0-.56.08-.853.4-.294.32-1.12 1.094-1.12 2.67 0 1.574 1.146 3.095 1.306 3.308.16.214 2.256 3.444 5.466 4.83.764.33 1.36.527 1.824.674.767.244 1.464.21 2.016.127.615-.092 1.893-.774 2.16-1.521.266-.747.266-1.387.186-1.521-.08-.133-.293-.213-.613-.373z"/>
          </svg>
        </a>
      </LocaleProvider>
    </QueryClientProvider>
  );
}
