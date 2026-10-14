#!/bin/bash
# Tablo Wellness — statik dagitim
#
# Site sunucuda NODE VEYA DOCKER CALISTIRMAZ. nginx tek bir dizini servis eder.
# Akis: SSR derle -> wget ile statik anlik goruntu al -> sunucuya rsync'le.
#
# Kullanim:
#   TABLO_SSH_HOST=<ssh-hedefi> ./deploy.sh
#
# ssh hedefi ortam degiskeninden gelir; depoya yazilmaz.

set -euo pipefail

SSH_HOST="${TABLO_SSH_HOST:?TABLO_SSH_HOST verin (or. TABLO_SSH_HOST=sunucum ./deploy.sh)}"
WEB_ROOT="${TABLO_WEB_ROOT:-/var/www/html/tablowellness}"
BACKUP_DIR="${TABLO_BACKUP_DIR:-/root/web-backups}"
OUT="static"
KATALOG="src/data/services.ts"

# Yalnizca dogrulama: derleme/yedek/rsync atlanir, 5. adim ve Cloudflare
# hatirlatmasi calisir. Dagitimdan sonra "gercekten gecti mi" diye bakmak icin.
SADECE_DOGRULA=0
[ "${1:-}" = "--dogrula" ] && SADECE_DOGRULA=1

# ── Hizmet sayisi SABIT YAZILMAZ, katalogdan turetilir ───────────────────
# Burada eskiden "9" yaziyordu ve bir zamanlar dogruydu (bkz. 3. adimdaki
# 20 Agustos 2026 notu: katalog 21'den 9'a inmisti). Sonra 8'e indi ve bu
# satir guncellenmedi — yani dogrulama o gunden beri HER deploy'da dustu.
# Dosyalar yazildiktan SONRA calistigi icin dagitimi durdurmadi, bu yuzden
# kimse fark etmedi; ama ardindan gelen Cloudflare uyarisinin basilmasini
# engelledi. 14 Ekim 2026'da tam bu yuzden edge eski gorselleri servis
# etmeye devam etti.
#
# Sayiyi tek dogru kaynaktan okumak, katalog degistiginde kontrolun
# kendiliginden dogru kalmasini saglar. Desen tutmazsa SESSIZCE 0'a dusmez,
# hata verir: turetilemeyen bir beklenti, yanlis bir beklentiden kotudur.
BEKLENEN_HIZMET="$(grep -cE '^[[:space:]]+slug: "[^"]+",' "$KATALOG" || true)"
[ "${BEKLENEN_HIZMET:-0}" -gt 0 ] || {
  echo "HATA: $KATALOG icinden hizmet sayisi turetilemedi (desen tutmadi)"
  exit 1
}
echo ">> katalog: $BEKLENEN_HIZMET hizmet ($KATALOG)"

if [ "$SADECE_DOGRULA" -eq 0 ]; then

echo ">> 1/5 Statik anlik goruntu uretiliyor"
bash scripts/build-static.sh
[ -d "$OUT" ] || { echo "HATA: $OUT/ uretilmedi"; exit 1; }

# Derleme katalogdaki her hizmeti uretti mi? Sunucuya YAZMADAN once bak:
# eksik sayfayi dagittiktan sonra fark etmek, --delete ile eskisini de
# silmis olmak demek.
URETILEN="$(find "$OUT/hizmetler" -name '*.html' 2>/dev/null | wc -l | tr -d ' ')"
[ "$URETILEN" -eq "$BEKLENEN_HIZMET" ] || {
  echo "HATA: derleme $URETILEN hizmet sayfasi uretti, katalogda $BEKLENEN_HIZMET var"
  exit 1
}

echo ">> 2/5 Sunucuda tarihli yedek"
# --delete geri alinamaz; yedek once alinir.
STAMP="$(date +%Y-%m-%d-%H%M)"
ssh "$SSH_HOST" "mkdir -p '$BACKUP_DIR' && cp -a '$WEB_ROOT' '$BACKUP_DIR/tablowellness.$STAMP' && echo '   yedek: $BACKUP_DIR/tablowellness.$STAMP'"

echo ">> 3/5 Degisiklik onizlemesi"
# --delete SART: onceki surumden kalan dosyalar aksi halde yayinda kalir.
# 20 Agustos 2026'da site 21 hizmet sayfasindan 9'a inerken tam bu oldu;
# tar ile yazilsaydi 17 eski sayfa ve iki eski medya klasoru servis edilmeye
# devam edecekti.
rsync -a --delete --no-owner --no-group --itemize-changes --dry-run \
  "$OUT/" "$SSH_HOST:$WEB_ROOT/"

echo ">> 4/5 Yaziliyor"
# --no-owner --no-group: arsiv/derleme yerel makinede uretiliyor ve oradaki
# uid sunucuda tanimsiz olabilir. Sahiplik sunucuda ayarlanir.
rsync -a --delete --no-owner --no-group "$OUT/" "$SSH_HOST:$WEB_ROOT/"
ssh "$SSH_HOST" "
  chown -R root:www-data '$WEB_ROOT'
  find '$WEB_ROOT' -type d -exec chmod 755 {} +
  find '$WEB_ROOT' -type f -exec chmod 644 {} +
"

fi  # SADECE_DOGRULA

echo ">> 5/5 Dogrulama — durum kodu degil, icerik"
ssh "$SSH_HOST" "
  set -e
  n=\$(find '$WEB_ROOT' -type f | wc -l)
  h=\$(find '$WEB_ROOT/hizmetler' -name '*.html' | wc -l)
  echo \"   dosya: \$n   hizmet sayfasi: \$h (katalog: $BEKLENEN_HIZMET)\"
  [ \"\$h\" -eq $BEKLENEN_HIZMET ] || { echo \"   HATA: $BEKLENEN_HIZMET hizmet sayfasi bekleniyordu, \$h bulundu\"; exit 1; }
  grep -qa 'medya/hero.mp4' '$WEB_ROOT/index.html' || { echo '   HATA: hero videosu ana sayfada yok'; exit 1; }
  echo '   dogrulama gecti'
"

cat <<'SON'

>> Dagitim tamam.

   SON ADIM — Cloudflare onbellegini temizleyin.
   Varliklar bir yillik `immutable` ile onbellege aliniyor; silinmis bir dosya
   temizlenmezse edge'de saatlerce 200 donmeye devam eder. 20 Agustos 2026'da
   olculdu: origin 404 verirken eski bir stylesheet edge'den HIT ile 200
   donuyordu.
SON
