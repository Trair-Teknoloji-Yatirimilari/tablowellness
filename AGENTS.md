# Tablo Wellness — ajan notlari

TanStack Start (React + TypeScript + Vite) ile yazilmis **statik** tanitim sitesi.

## Bilinmesi gerekenler
- **Veritabani yok.** Blog, uyelik ve admin paneli bu projede YOKTUR; kaldirilmistir.
  Yeniden eklemeyin.
- **Randevu** talebi WhatsApp'a yonlendirilir (`src/components/AppointmentForm.tsx`).
  Form hicbir yere kayit yazmaz.
- **Diller:** TR (varsayilan) + EN. Sozlukler `src/i18n/dictionaries/`.
- **Marka ve iletisim bilgisi tek kaynaktan gelir:** `src/data/site.ts` (`SITE`).
  Telefon, adres, e-posta, domain, sosyal medya HICBIR dosyada hardcode edilmez.
- **Hizmet katalogu:** `src/data/services.ts`. Sayfalar bu diziden uretilir.

## Icerik kurallari
Musteri onayi olmadan olgusal iddia yazilmaz: fiyat, kurulus yili, uye sayisi,
m2, odul, sertifika, musteri yorumu, saglik iddiasi (tedavi eder / iyilestirir)
KULLANILMAZ.

## Komutlar
```
npm install
npm run dev
npm run build
```

## Deploy
`deploy.sh` yapilandirilmadan calismaz. Icindeki DOLDURULACAK degiskenler
(sunucu yolu, compose dosyasi, container adi, port) ayarlanmadan
`DEPLOY_CONFIGURED=1` verilmemelidir.
