#!/bin/bash
# Tablo Wellness - statik snapshot uretici
#
# TanStack Start SSR olarak derlenir, gecici olarak localhost'ta calistirilir
# ve tum sayfalar wget ile statik HTML olarak cekilir. Cikti: ./static/
# Sunucuda Node/Docker CALISMAZ - sadece nginx statik dizin servis eder.
set -euo pipefail

PORT="${PORT:-3111}"
OUT="${OUT:-static}"

echo ">> Bagimliliklar"
npm ci --no-audit --no-fund

echo ">> SSR build (node-server preset)"
NITRO_PRESET=node-server npm run build

echo ">> Gecici sunucu :$PORT"
PORT="$PORT" node .output/server/index.mjs &
SRV_PID=$!
trap 'kill $SRV_PID 2>/dev/null || true' EXIT

for i in $(seq 1 30); do
  curl -sf -o /dev/null "http://localhost:$PORT/" && break
  sleep 1
  [ "$i" = 30 ] && { echo "HATA: sunucu ayaga kalkmadi"; exit 1; }
done

echo ">> Statik snapshot -> $OUT/"
rm -rf "$OUT"; mkdir -p "$OUT"
( cd "$OUT" && wget --quiet --recursive --level=inf --page-requisites \
    --adjust-extension --no-host-directories --reject-regex '.*\?.*' \
    "http://localhost:$PORT/" )

# router disi uclar
# favicon.ico BURADA OLMAK ZORUNDA: wget --page-requisites onu <link rel="icon">
# uzerinden guvenilir sekilde cekmiyor ve snapshot'ta eksik kaliyordu. 20 Agustos
# 2026'da olculdu: canli sitede /favicon.ico 404 doneriyordu, oysa HTML ona atif
# yapiyor. Eksik dosya sessizdi cunku o 404'u kimse gormuyor.
curl -sf "http://localhost:$PORT/kvkk"        -o "$OUT/kvkk.html"
curl -sf "http://localhost:$PORT/sitemap.xml"  -o "$OUT/sitemap.xml"
curl -sf "http://localhost:$PORT/robots.txt"   -o "$OUT/robots.txt"
curl -sf "http://localhost:$PORT/favicon.ico"  -o "$OUT/favicon.ico"

kill $SRV_PID 2>/dev/null || true

COUNT=$(find "$OUT" -type f | wc -l | tr -d ' ')
echo ">> Tamam: $COUNT dosya, $(du -sh "$OUT" | cut -f1)"

# saglik kontrolu - beklenen sayfalar var mi
MISSING=0
for f in index.html hizmetler.html kvkk.html sitemap.xml robots.txt favicon.ico apple-touch-icon.png; do
  [ -f "$OUT/$f" ] || { echo "EKSIK: $f"; MISSING=1; }
done
EXPECTED_SERVICES=8
FOUND=$(find "$OUT/hizmetler" -name '*.html' 2>/dev/null | wc -l | tr -d ' ')
[ "$FOUND" -eq "$EXPECTED_SERVICES" ] || { echo "UYARI: hizmet sayfasi $FOUND (beklenen $EXPECTED_SERVICES)"; MISSING=1; }
[ "$MISSING" = 0 ] && echo ">> Dogrulama gecti" || { echo ">> DOGRULAMA BASARISIZ"; exit 1; }
