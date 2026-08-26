# Deploy — Tablo Wellness

Site **veritabanısız**. Sunucuda **Node veya Docker çalışmaz** — nginx tek bir
dizini servis eder. Kaynak SSR olarak derlenir, statik anlık görüntüye çevrilir
ve o görüntü sunucuya kopyalanır.

```
npm run build  ─┐
                ├─► scripts/build-static.sh ─► static/ ─► rsync ─► nginx
wget snapshot  ─┘
```

## Kullanılan yöntem — statik anlık görüntü + rsync

```bash
TABLO_SSH_HOST=<ssh-hedefi> ./deploy.sh
```

`deploy.sh` sırayla: statik çıktıyı üretir, sunucuda **tarihli yedek** alır,
`rsync --dry-run` ile değişiklik önizlemesi gösterir, `rsync -a --delete` ile
yazar, sahiplik ve izinleri düzeltir, sonra içerik doğrulaması yapar.

### `--delete` neden zorunlu

Yalnızca yazan bir kopyalama (`tar`, `scp -r`) önceki sürümden kalan dosyaları
web kökünde bırakır ve o dosyalar yayında kalmaya devam eder. 20 Ağustos
2026'da site 21 hizmet sayfasından 9'a inerken tam bu risk vardı: `--delete`
olmasa 17 eski sayfa ve iki eski medya klasörü servis edilmeye devam edecekti.

### Dağıtım sonrası — Cloudflare önbelleği

Varlıklar bir yıllık `immutable` ile önbelleğe alınıyor. **Silinen bir dosya
temizlenmezse edge'de aylarca 200 dönebilir.** Ölçüldü: origin `404` verirken
eski bir stylesheet edge'den `cf-cache-status: HIT` ile `200` dönüyordu. Her
dağıtımdan sonra Cloudflare önbelleği temizlenmeli.

### Emekli sayfalar

Bir hizmet sayfası kaldırılırsa eski yolu 404'e bırakmayın — indekslenmiş ve
dışarıdan link almış olabilir. Sunucu tarafında `301` tanımlanır (nginx
`map`); kalıcı birleşmede `302` link değerini taşımaz.

## Derleme tekrarlanabilir DEĞİL — kaynak/canlı karşılaştırması

TanStack Router, SSR yükünün içine derleme anını epoch-ms olarak gömüyor
(`u:1787223139233`). Aynı kaynaktan iki kez derlerseniz **her HTML dosyası
12–16 bayt farklı** çıkar. İçerik aynıdır, hash farklıdır.

Bu yüzden "repo ile canlı aynı mı" sorusu düz `md5`/`rsync -c` ile
cevaplanamaz — her seferinde 12 dosya farklı görünür ve gerçek bir sapma bu
gürültünün içinde kaybolur. Karşılaştırmadan önce damgayı normalleştirin:

```bash
sed -E 's/u:[0-9]{13}/u:T/g' dosya.html | md5sum
```

20 Ağustos 2026'da ölçüldü: 12 HTML dosyasının 12'si bu şekilde normalleştirilince
canlıyla **birebir aynı**; ham hash ise 12'sinde de farklıydı.

## Alan adları

`tablowellness.com` kanonik. `www` ve `tablowellness.com.tr` (+`www`)
`301` ile ona gider. Dördü tek Let's Encrypt sertifikasında.

## Ortam değişkenleri

Tek opsiyonel değişken: `VITE_GA_ID`. Boş bırakılırsa Google Analytics
yüklenmez — varsayılan budur. Örnek: `.env.example`.

## Kullanılmayan iki alternatif

Derleme bunları da üretiyor, ama **şu an kullanılmıyorlar**:

- **Cloudflare Workers** — `npm run deploy:cf` (`.output/server/wrangler.json`
  otomatik üretiliyor). SSR'ı edge'de çalıştırır; statik anlık görüntü
  yaklaşımının yerine geçer, ikisi birlikte kullanılmaz.
- **Docker** — `Dockerfile` SSR sunucusunu paketler ve `:3000` dinler. Bu site
  için kurulmuş bir container yok.

Birine geçilecekse bu dosya önce güncellenmeli; iki farklı dağıtım anlatan bir
doküman, hangisinin gerçek olduğunu bilmeyen bir sonraki kişiyi yanıltır.
