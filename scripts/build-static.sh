#!/bin/bash
# Tablo Wellness — statik snapshot uretici
#
# TanStack Start SSR olarak derlenir, gecici olarak localhost'ta calistirilir
# ve sayfalar statik HTML olarak cekilir. Cikti: ./static/
# Sunucuda Node/Docker CALISMAZ — sadece nginx statik dizin servis eder.
#
# ─── IKI TASARIM KARARI ────────────────────────────────────────────────
#
# 1) VARLIKLAR TARANMAZ, KOPYALANIR.
#    Nitro derlemesi `.output/public` altinda client JS, CSS, favicon,
#    apple-touch-icon ve medya/ dosyalarinin TAMAMINI zaten uretiyor.
#    Varlik kumesi kesfedilecek bir sey degil — derleme ciktisinin kendisi.
#    Oldugu gibi kopyalaniyor.
#
#    Onceki surum `wget --page-requisites` ile varliklari KESFETMEYE
#    calisiyordu ve `<link rel="icon">` etiketini takip etmiyordu; sonucu:
#    favicon.ico snapshot'a hic girmedi, canli sitede /favicon.ico 404
#    donerken HTML ona atif yapmaya devam etti. Kimse bir favicon 404'unu
#    gormedigi icin haftalarca sessiz kaldi. Kesfi kaldirinca bu hata
#    SINIF OLARAK yok oluyor.
#
# 2) SAYFA LISTESI SITEMAP'TEN GELIR.
#    Taranmasi gereken tek sey HTML sayfalari ve onlarin listesi zaten
#    sitemap'te. Bag kesfine dayanmak, bir sayfa hicbir yerden link
#    almadiginda onu sessizce disarida birakir.
#
# Bagimlilik: curl (macOS ve sunucularda hazir). wget GEREKMEZ.

set -euo pipefail

PORT="${PORT:-3111}"
OUT="${OUT:-static}"
EXPECTED_SERVICES=8

log() { echo ">> $*"; }
die() { echo "HATA: $*" >&2; exit 1; }

log "1/6 Bagimliliklar"
npm ci --no-audit --no-fund

# NITRO_PRESET PINLENDI. Duz `npm run build` bu projede Cloudflare Worker
# ciktisi uretiyor (.output/server/wrangler.json) ve `node` onu
# CALISTIRAMAZ — sunucu sessizce olur, log bos kalir. 26 Agustos 2026'da
# tam bu yasandi. node-server on ayari zorunlu.
log "2/6 SSR build (node-server preset)"
NITRO_PRESET=node-server npm run build

[ -f .output/server/index.mjs ] || die ".output/server/index.mjs yok"
[ -d .output/public ] || die ".output/public yok"

log "3/6 Gecici sunucu :$PORT"
PORT="$PORT" node .output/server/index.mjs > /tmp/tablo-ssr.log 2>&1 &
SRV_PID=$!
trap 'kill $SRV_PID 2>/dev/null || true' EXIT

for i in $(seq 1 40); do
  curl -sf -o /dev/null "http://localhost:$PORT/" && break
  sleep 1
  if [ "$i" = 40 ]; then
    echo "--- sunucu logu ---" >&2; tail -20 /tmp/tablo-ssr.log >&2
    die "sunucu ayaga kalkmadi"
  fi
done

log "4/6 Varliklar kopyalaniyor (.output/public -> $OUT)"
rm -rf "$OUT"; mkdir -p "$OUT"
cp -R .output/public/. "$OUT"/

log "5/6 Sayfalar cekiliyor (liste sitemap'ten)"
curl -sf "http://localhost:$PORT/sitemap.xml" -o "$OUT/sitemap.xml" \
  || die "sitemap.xml alinamadi"
curl -sf "http://localhost:$PORT/robots.txt"  -o "$OUT/robots.txt" \
  || die "robots.txt alinamadi"

# sed -E ZORUNLU: BSD sed (macOS) temel regex'te `\?` desteklemiyor ve
# host ayiklanmadan kaliyor; sonuc `static/https:/...` diye bir dizin.
# -E her iki sed'de de (BSD ve GNU) genisletilmis regex acar.
PATHS=$(grep -o '<loc>[^<]*</loc>' "$OUT/sitemap.xml" \
        | sed -E 's|</?loc>||g' \
        | sed -E 's|^https?://[^/]*||' \
        | sed -E 's|^$|/|')

PAGE_COUNT=0
while IFS= read -r p; do
  [ -z "$p" ] && continue
  rel="${p#/}"
  if [ -z "$rel" ]; then dest="$OUT/index.html"; else dest="$OUT/$rel.html"; fi
  mkdir -p "$(dirname "$dest")"
  # `|| true`: curl gecersiz URL'de 3 ile cikar ve `set -e` altinda script
  # MESAJSIZ olur. Kodu once yakala, sonra kendi hatamizi bas.
  code=$(curl -s -o "$dest" -w '%{http_code}' "http://localhost:$PORT$p" || true)
  [ "$code" = "200" ] || die "$p -> HTTP ${code:-baglanti hatasi} (200 bekleniyordu)"
  PAGE_COUNT=$((PAGE_COUNT + 1))
done <<< "$PATHS"

log "6/6 Sunucu kapatiliyor"
kill $SRV_PID 2>/dev/null || true
trap - EXIT

# ─── SAGLIK KONTROLU ───────────────────────────────────────────────────
log "Dogrulama"
FAIL=0
fail() { echo "  EKSIK: $*" >&2; FAIL=1; }

URL_COUNT=$(grep -c '<loc>' "$OUT/sitemap.xml")
HTML_COUNT=$(find "$OUT" -name '*.html' | wc -l | tr -d ' ')
[ "$URL_COUNT" = "$PAGE_COUNT" ] \
  || fail "sitemap $URL_COUNT URL, cekilen $PAGE_COUNT sayfa"
[ "$HTML_COUNT" = "$PAGE_COUNT" ] \
  || fail "diskte $HTML_COUNT html, cekilen $PAGE_COUNT"

SVC=$(find "$OUT/hizmetler" -name '*.html' 2>/dev/null | wc -l | tr -d ' ')
[ "$SVC" = "$EXPECTED_SERVICES" ] \
  || fail "hizmet sayfasi $SVC (beklenen $EXPECTED_SERVICES)"

for f in index.html hizmetler.html kvkk.html sitemap.xml robots.txt \
         favicon.ico apple-touch-icon.png; do
  [ -f "$OUT/$f" ] || fail "$f yok"
done

# Skyland'de favicon EKSIK degildi — YANLIS dosya gitmisti. Varligini
# kontrol etmek yetmez, boyutu da bakilir.
for f in favicon.ico apple-touch-icon.png; do
  if [ -f "$OUT/$f" ]; then
    sz=$(wc -c < "$OUT/$f" | tr -d ' ')
    [ "$sz" -gt 1000 ] || fail "$f cok kucuk ($sz bayt) — yanlis dosya olabilir"
  fi
done

EMPTY=$(find "$OUT" -type f -size 0 | wc -l | tr -d ' ')
[ "$EMPTY" = "0" ] || { find "$OUT" -type f -size 0 >&2; fail "$EMPTY adet 0 bayt dosya"; }

echo "   $PAGE_COUNT sayfa, $(find "$OUT" -type f | wc -l | tr -d ' ') dosya, $(du -sh "$OUT" | cut -f1)"
[ "$FAIL" = "0" ] || die "DOGRULAMA BASARISIZ"
log "Dogrulama gecti"
