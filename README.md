# Tablo Wellness

Tablo Wellness (İstanbul) tesisinin tanıtım sitesi: spa, fitness ve
kapalı yüzme havuzu hizmetleri, hizmet detay sayfaları, SSS ve WhatsApp üzerinden
randevu talebi.

- **Yığın:** TanStack Start · React 19 · TypeScript · Tailwind CSS 4 · motion
- **Veritabanı yok.** Site tamamen statik içerikle çalışır; blog, üyelik ve
  yönetici paneli bulunmaz. Randevu formu veri kaydetmez, girilen bilgileri
  hazır bir WhatsApp mesajına dönüştürür.
- **Diller:** Türkçe (varsayılan) ve İngilizce.

## İçerik nerede

| Ne | Dosya |
| --- | --- |
| Marka, telefon, adres, e-posta, domain, Instagram, GA kimliği | `src/data/site.ts` |
| Hizmet kataloğu ve hizmet detay sayfaları | `src/data/services.ts` |
| Arayüz metinleri (TR/EN) | `src/i18n/dictionaries/` |
| Sayfalar (rotalar) | `src/routes/` |

İletişim bilgisi hiçbir bileşende hardcode edilmez; her zaman `src/data/site.ts`
içindeki `SITE` sabitinden okunur.

## Kurulum

Node.js 22 gerekir.

```sh
npm install
npm run dev      # http://localhost:5173
```

## Build

```sh
npm run build    # .output/ üretir
npm run preview
```

Google Analytics isteğe bağlıdır: `VITE_GA_ID` build sırasında verilmezse (ve
`SITE.gaId` boşsa) gtag script'i hiç yüklenmez. Örnek için `.env.example`.

Docker:

```sh
docker build --build-arg VITE_GA_ID= -t tablo-wellness .
docker run -p 3000:3000 tablo-wellness
```

## Deploy

Site sunucuda **Node veya Docker çalıştırmaz** — nginx tek bir dizini servis
eder. `deploy.sh` statik anlık görüntüyü üretir, sunucuda tarihli yedek alır,
`rsync -a --delete` ile yazar ve içerik doğrulaması yapar:

```bash
TABLO_SSH_HOST=<ssh-hedefi> ./deploy.sh
```

ssh hedefi ortam değişkeninden gelir, depoya yazılmaz. `TABLO_WEB_ROOT` ve
`TABLO_BACKUP_DIR` isteğe bağlıdır.
