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

`deploy.sh` sunucudaki container'ı yeniden derler. **Yapılandırılmadan
çalıştırılmaz:** script içindeki `DOLDURULACAK` işaretli değişkenler (sunucu,
repo yolu, compose dosyası, container ön eki, port) doğru değerlerle
doldurulmalı, ardından `DEPLOY_CONFIGURED=1 ./deploy.sh` ile çalıştırılmalıdır.
Aksi halde script hata verip durur.
