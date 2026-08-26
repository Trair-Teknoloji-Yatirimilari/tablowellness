/**
 * Tablo Wellness — merkezi site/marka bilgisi.
 *
 * Tum iletisim/marka bilgisi TEK yerden bu dosyadan gelir;
 * baska dosyalarda telefon/adres/e-posta hardcode ETMEYIN.
 *
 * TODO isaretli alanlar musteriden henuz alinmadi. Telefon ve adres
 * 26 Agustos 2026'da gercek bilgiyle dolduruldu.
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

  /**
   * BOS: bu alan adinda posta kutusu YOK. Musteri kisisel Gmail
   * kullaniyor ve o adres siteye yazilmaz. Kutu acildiginda buraya
   * yazilir; bos oldugu surece e-posta gosteren her yer KOSULLU olarak
   * hic render edilmez (bkz. SiteFooter ve iletisim bolumu). Olmayan
   * bir adresi yayina koymak, bos bir "mailto:" birakmaktan da kotu.
   */
  email: "",

  phone: "+905422631719",
  phoneDisplay: "+90 542 263 17 19",
  /** WhatsApp icin uluslararasi format, + ve bosluk olmadan */
  whatsapp: "905422631719",

  address: {
    line1: "Zümrütevler Mah., Emek Cad. No:77 D:83B",
    /** Bos — addressOneLine/MultiLine filter(Boolean) ile eliyor. */
    line2: "",
    city: "Maltepe / İstanbul",
    postCode: "34852",
    mapsQuery: "Zümrütevler+Mah.+Emek+Cad.+No:77+D:83B+34852+Maltepe+İstanbul",
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
