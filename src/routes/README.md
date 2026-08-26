# Routes

TanStack Start uses **file-based routing**. Every `.tsx` file in this directory
defines a route. Do **not** create `src/pages/`, `src/routes/_app/index.tsx`, or
`app/layout.tsx` — those are Next.js / Remix conventions. The only root layout
is `src/routes/__root.tsx`.

## Conventions

| File | URL |
| --- | --- |
| `index.tsx` | `/` |
| `about.tsx` | `/about` |
| `users/index.tsx` | `/users` |
| `users/$id.tsx` | `/users/:id` (dynamic — bare `$`, no curly braces) |
| `posts/{-$category}.tsx` | `/posts/:category?` (optional segment) |
| `files/$.tsx` | `/files/*` (splat — read via `_splat` param, never `*`) |
| `_layout.tsx` | layout route (renders children via `<Outlet />`) |
| `__root.tsx` | app shell — wraps every page; preserve `<Outlet />` |

`routeTree.gen.ts` is auto-generated. Don't edit it by hand.

## Bu projedeki rotalar

| Dosya | URL | Ne yapar |
| --- | --- | --- |
| `__root.tsx` | — | Uygulama kabuğu: meta/hreflang, opsiyonel GA, WhatsApp butonu, 404 ve hata ekranları |
| `index.tsx` | `/` | Tek sayfalık ana sayfa (hero, tesis, hizmetler, galeri, SSS, iletişim + randevu formu) |
| `hizmetler.index.tsx` | `/hizmetler` | Hizmet kataloğu; `SERVICES` içindeki ana başlıklar ve alt başlıkları |
| `hizmetler.$slug.tsx` | `/hizmetler/:slug` | Hizmet detay sayfası; slug `src/data/services.ts` ile eşleşmezse 404 |
| `kvkk.tsx` | `/kvkk` | KVKK aydınlatma metni (içerik `t.legal` sözlüğünden) |
| `sitemap[.]xml.tsx` | `/sitemap.xml` | `SERVICES` üzerinden üretilen sitemap |

Blog, kimlik doğrulama (`auth`), yönetici paneli (`_authenticated/**`) ve dosya
yükleme rotaları bu projeden kaldırılmıştır; yeniden eklenmemelidir.

## Notlar

- Sayfa metinleri `src/i18n/dictionaries/` içinden `useT()` ile okunur; JSX
  içine sabit metin yazmaktan kaçının.
- Kanonik URL, alternate ve OG adresleri `SITE.url` üzerinden kurulur; domain
  hiçbir rotada hardcode edilmez.
- `head()` fonksiyonları React bileşeni değildir, hook çağıramaz. Meta metni
  için `tr` sözlüğü doğrudan import edilir (varsayılan dil).
