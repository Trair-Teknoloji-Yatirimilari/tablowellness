/**
 * Tablo Wellness — merkezi site/marka bilgisi.
 *
 * Tum iletisim/marka bilgisi TEK yerden bu dosyadan gelir;
 * baska dosyalarda telefon/adres/e-posta hardcode ETMEYIN.
 *
 * TODO isaretli alanlar musteriden henuz alinmadi.
 *
 * Bu proje baska bir musteri sitesinin kod tabanindan turetildi. O
 * projenin GERCEK ILETISIM BILGILERI TASINMADI ve tasinmamalidir:
 * baska bir isletmeye ait telefon, adres, sosyal hesap veya olcum
 * kimligi bu siteye ASLA yazilmaz.
 */
export const SITE = {
  name: "Tablo Wellness",
  tagline: "Spa · Fitness · Havuz",

  domain: "tablowellness.com",
  url: "https://tablowellness.com",
  /** Ikinci domain — .com'a 301 yonlendirilecek */
  altDomain: "tablowellness.com.tr",

  /** TODO: gercek e-posta kutusu acilinca dogrula */
  email: "info@tablowellness.com",
  mailFrom: "Tablo Wellness <iletisim@tablowellness.com>",

  /** TODO: GERCEK TELEFON ALINMADI. Yayina almadan once doldurun. */
  phone: "+900000000000",
  phoneDisplay: "+90 000 000 00 00",
  /** WhatsApp icin uluslararasi format, + ve bosluk olmadan */
  whatsapp: "900000000000",

  /** TODO: GERCEK ADRES ALINMADI. Yayina almadan once doldurun. */
  address: {
    line1: "TODO Mahallesi, TODO Caddesi No:0",
    line2: "",
    city: "İstanbul",
    postCode: "",
    mapsQuery: "Tablo+Wellness+İstanbul",
  },

  /** TODO: gercek calisma saatleri musteriden alinacak */
  hours: {
    weekday: "",
    weekend: "",
  },

  /** TODO: gercek hesap adresi alinacak */
  social: {
    instagram: "https://www.instagram.com/",
    instagramHandle: "@tablowellness",
    youtube: "",
  },

  /** TODO: bu site icin GA mulkiyeti acilinca doldurulacak.
   *  BOS BIRAKILIRSA GA hic yuklenmez — varsayilan budur. Baska bir
   *  projenin olcum kimligi buraya YAZILMAZ: veri iki siteye karisir. */
  gaId: "",
} as const;

export const addressOneLine = [
  SITE.address.line1,
  SITE.address.line2,
  `${SITE.address.postCode} ${SITE.address.city}`.trim(),
].filter(Boolean).join(", ");

export const addressMultiLine = [
  SITE.address.line1,
  SITE.address.line2,
  `${SITE.address.postCode} ${SITE.address.city}`.trim(),
].filter(Boolean).join("\n");

export const mapsUrl =
  `https://www.google.com/maps/search/?api=1&query=${SITE.address.mapsQuery}`;

export const whatsappUrl = `https://wa.me/${SITE.whatsapp}`;
