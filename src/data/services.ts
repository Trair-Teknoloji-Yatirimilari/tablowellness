/* ---------------------------------------------------------------------------
 * Tablo Wellness — hizmet kataloğu
 *
 * Katalog, tesiste gerçekten bulunan 9 ana hizmetten oluşur. Alt hizmet
 * (parent) kaydı yoktur. Metinler, tesisin kendi tanıtım görsellerinde
 * görünenle sınırlı tutulmuştur ve bilinçli olarak şunları İÇERMEZ
 * (müşteri yazılı onayı olmadan eklenmemelidir):
 *   - fiyat, üyelik ücreti, paket veya seans sayısı/süresi
 *   - m², kapasite, ekipman markası, çalışma saati
 *   - sertifika, ödül, akreditasyon, "X yıllık tecrübe" gibi iddialar
 *   - müşteri yorumu / referans / başarı oranı
 *   - sağlık iddiası ("tedavi eder", "iyileştirir", "zayıflatır" vb.)
 * `image` alanları yalnızca public/medya/ altındaki gerçek dosyaları
 * gösterir; başka bir görsel yolu kullanılmamalıdır.
 * ------------------------------------------------------------------------ */

export interface ServicePage {
  slug: string;
  name: string;
  seoTitle: string;
  seoDescription: string;
  hero: string;
  image: string;
  intro: string;
  sections: { h: string; p?: string; list?: string[] }[];
  faqs: { q: string; a: string }[];
  related: string[];
  parent?: string;
  /** Ana katalog disi baslik. Footer'da listelenmez, /hizmetler'de
   *  ayri bolumde gosterilir. 301 hedefi olarak yayinda kalir. */
  secondary?: boolean;
}

export const SERVICES: ServicePage[] = [
  {
    slug: "fitness",
    name: "Fitness & Kondisyon",
    seoTitle: "Fitness & Kondisyon | Tablo Wellness",
    seoDescription:
      "Kardiyo ve ağırlık bölümleriyle fitness alanımızda kendi temponuzda çalışabilirsiniz.",
    hero: "Kendi temponuzda antrenman",
    image: "/medya/fitness.webp",
    intro:
      "Fitness alanımız, koyu tonlu ve geniş bir salon içinde kardiyo ve ağırlık bölümlerini bir arada barındırır. Zeminde ayrılmış sled koridoru sayesinde itme-çekme çalışmalarını da aynı alanda sürdürebilirsiniz. Serbest çalışabilir ya da alandaki ekibimizden yönlendirme isteyebilirsiniz.",
    sections: [
      {
        h: "Alanda neler var?",
        list: [
          "Kardiyo bölümü",
          "Ağırlık ve makine bölümü",
          "Zeminde ayrılmış sled koridoru",
          "Serbest çalışma alanı",
        ],
      },
      {
        h: "Alan kullanımı",
        p: "Kullandığınız ekipmanı sonrasında yerine bırakmanız ve alan içinde uygun spor ayakkabısı kullanmanız beklenir. Ekipman ayarları veya hareketlerin uygulanışıyla ilgili destek almak isterseniz alandaki ekibimize danışabilirsiniz.",
      },
      {
        h: "Başlamadan önce",
        p: "Bilinen bir sağlık durumunuz varsa ya da düzenli egzersize uzun bir aradan sonra dönüyorsanız, başlamadan önce kendi hekiminize danışmanız uygun olur.",
      },
    ],
    faqs: [
      {
        q: "Alanı ilk kez kullanacağım, yönlendirme alabilir miyim?",
        a: "Alandaki ekibimizden ekipmanların kullanımı hakkında bilgi isteyebilirsiniz.",
      },
      {
        q: "Sled koridorunu herkes kullanabilir mi?",
        a: "Koridor ortak kullanımdadır; ilk kez kullanacaksanız ekibimizden yönlendirme almanız önerilir.",
      },
      {
        q: "Kendi ekipmanımı getirebilir miyim?",
        a: "Eldiven, kayış ve mat gibi kişisel ekipmanlarınızı getirebilirsiniz.",
      },
    ],
    related: ["hyrox", "kisisel-antrenman", "grup-dersleri"],
  },
  {
    slug: "hyrox",
    name: "Hyrox & Fonksiyonel Antrenman",
    seoTitle: "Hyrox & Fonksiyonel Antrenman | Tablo Wellness",
    seoDescription:
      "Fonksiyonel antrenman alanımızda serbest hareket alanıyla istasyon ve devre çalışmaları yapabilirsiniz.",
    hero: "Hareket odaklı çalışma alanı",
    image: "/medya/hyrox.webp",
    intro:
      "Fonksiyonel antrenman alanımız, makinelerin arasında sıkışmadan çalışabileceğiniz açık bir zemin sunar. Serbest hareket alanı sayesinde istasyon ve devre tipi çalışmaları kesintisiz sürdürebilirsiniz. Çalışma akışınızı kendiniz kurabilir ya da eğitmen eşliğinde planlayabilirsiniz.",
    sections: [
      {
        h: "Alanın öne çıkan yanı",
        p: "Alanın tamamı serbest hareket için ayrılmıştır; istasyonlar arasında geçiş yaparken duraklamak gerekmez. Bu yapı, tekrarlı ve peş peşe ilerleyen çalışma akışlarına uygundur.",
      },
      {
        h: "Nasıl çalışılır?",
        list: [
          "Kendi akışınızda serbest çalışma",
          "İstasyon ve devre tipi çalışma",
          "Eğitmen eşliğinde planlanan çalışma",
        ],
      },
      {
        h: "Başlamadan önce",
        p: "Hareket kalıplarına yeni başlıyorsanız temponuzu kademeli artırmanız önerilir. Bilinen bir sağlık durumunuz varsa kendi hekiminize danışmanız uygun olur.",
      },
    ],
    faqs: [
      {
        q: "Fonksiyonel antrenmanla klasik fitness arasındaki fark nedir?",
        a: "Fonksiyonel çalışmada hareket kalıpları ve akış öne çıkar; klasik fitness bölümünde ise kardiyo ve ağırlık istasyonları üzerinden ilerlenir.",
      },
      {
        q: "Daha önce hiç bu tarz çalışmadım, uygun mu?",
        a: "Mevcut durumunuzu eğitmene belirtmeniz yeterlidir; akış buna göre yönlendirilir.",
      },
      {
        q: "Ne getirmeliyim?",
        a: "Rahat spor kıyafeti, uygun spor ayakkabısı ve su şişesi yeterlidir.",
      },
    ],
    related: ["fitness", "kisisel-antrenman", "cold-plunge"],
  },
  {
    slug: "kisisel-antrenman",
    name: "Kişisel Antrenman",
    seoTitle: "Kişisel Antrenman | Tablo Wellness",
    seoDescription:
      "Eğitmen eşliğinde birebir ilerleyen antrenman seçeneğimiz hakkında genel bilgi.",
    hero: "Eğitmen eşliğinde birebir",
    image: "/medya/kisisel-antrenman.webp",
    intro:
      "Kişisel antrenmanda bir eğitmen çalışma boyunca yanınızda kalır; makine ayarlarından hareketin uygulanışına kadar süreci birlikte yürütürsünüz. Çalışma planı, hedefleriniz ve mevcut durumunuz konuşularak belirlenir ve süreç içinde birlikte gözden geçirilir.",
    sections: [
      {
        h: "Nasıl ilerliyor?",
        p: "İlk görüşmede beklentileriniz, alışkanlıklarınız ve varsa daha önceki antrenman geçmişiniz üzerine konuşulur. Ardından çalışma planı oluşturulur; sıklık ve program randevuda birlikte planlanır.",
      },
      {
        h: "Çalışma sırasında",
        p: "Eğitmen makine ayarlarını sizinle birlikte yapar ve hareketin uygulanışını çalışma boyunca takip eder. Zorlandığınız bir noktada temponun değişmesini isterseniz belirtmeniz yeterlidir.",
      },
      {
        h: "Başlamadan önce",
        p: "Bilinen bir sağlık durumunuz varsa, düzenli egzersize başlamadan önce kendi hekiminize danışmanız uygun olur.",
      },
    ],
    faqs: [
      {
        q: "Eğitmenimi seçebilir miyim?",
        a: "Tercihinizi randevu sırasında paylaşabilirsiniz; uygunluk durumuna göre planlama yapılır.",
      },
      {
        q: "Daha önce hiç spor yapmadım, uygun mu?",
        a: "Mevcut durumunuzu ilk görüşmede paylaşmanız yeterlidir; plan buna göre belirlenir.",
      },
      {
        q: "Ne sıklıkla çalışmalıyım?",
        a: "Sıklık kişiye göre değişir ve randevuda eğitmeninizle birlikte planlanır.",
      },
    ],
    related: ["fitness", "hyrox", "grup-dersleri"],
  },
  {
    slug: "grup-dersleri",
    name: "Grup Dersleri",
    seoTitle: "Grup Dersleri | Tablo Wellness",
    seoDescription:
      "Eğitmen eşliğinde, mat üzerinde ve açık alanda yürütülen grup derslerimiz hakkında genel bilgi.",
    hero: "Birlikte çalışmanın temposu",
    image: "/medya/grup-dersleri.webp",
    intro:
      "Grup derslerimiz, eğitmen yönlendirmesiyle ve kalabalık bir katılımla yürütülür. Dersler mat üzerinde, açık alanda yapılabilecek şekilde planlanır; herkesin eğitmeni görebileceği bir düzende ilerler. Güncel programa göre gün ve saat seçenekleri değişebilir.",
    sections: [
      {
        h: "Ders akışı",
        p: "Ders ısınma bölümüyle başlar ve eğitmenin belirlediği akışla devam eder. Zorlandığınız bir harekette temponuzu düşürebilir ya da eğitmenden alternatif isteyebilirsiniz.",
      },
      {
        h: "Katılım",
        p: "Derse zamanında katılmanız, ısınma bölümünü kaçırmamanız açısından önemlidir. Hangi derslerin hangi günlerde yapıldığını güncel programdan öğrenebilirsiniz.",
      },
      {
        h: "Ne getirmelisiniz?",
        p: "Rahat spor kıyafeti ve su şişesi yeterlidir. Derse özel ekipman gerekiyorsa katılım öncesinde bilgilendirme yapılır.",
      },
    ],
    faqs: [
      {
        q: "Daha önce hiç katılmadım, başlayabilir miyim?",
        a: "Seviyenizi ders öncesinde eğitmene belirtmeniz yeterlidir; akış buna göre yönlendirilir.",
      },
      {
        q: "Ders programını nereden öğrenebilirim?",
        a: "Güncel ders programı için bizimle iletişime geçebilirsiniz.",
      },
      {
        q: "Mat getirmem gerekir mi?",
        a: "Kendi matınızı getirmeyi tercih edebilirsiniz; sağlanan ekipman hakkında ekibimizden bilgi alabilirsiniz.",
      },
    ],
    related: ["fitness", "kisisel-antrenman", "havuz"],
  },
  {
    slug: "havuz",
    name: "Yüzme Havuzu",
    seoTitle: "Yüzme Havuzu | Tablo Wellness",
    seoDescription:
      "Yüzme havuzumuzun kullanımı ve genel havuz kuralları hakkında bilgi.",
    hero: "Su içinde geçen bir mola",
    image: "/medya/havuz.webp",
    intro:
      "Havuz alanımızda kendi temponuzda kulaç atabilir, antrenman gününüzü suda tamamlayabilirsiniz. Alanı kullanmadan önce genel havuz kurallarını okumanız ve görevlilerin yönlendirmelerine uymanız önerilir.",
    sections: [
      {
        h: "Havuz kullanım kuralları",
        list: [
          "Havuza girmeden önce duş almak",
          "Bone kullanmak",
          "Havuz kenarında koşmamak",
          "Görevlilerin yönlendirmelerine uymak",
        ],
      },
      {
        h: "Yanınızda bulunması gerekenler",
        p: "Mayo veya şort mayo, bone ve havlu kişisel olarak getirilmelidir. Diğer ihtiyaçlarınız için ekibimizden bilgi alabilirsiniz.",
      },
      {
        h: "Kullanım saatleri",
        p: "Havuzun kullanıma açık olduğu aralıklar güncel programa göre değişebilir; planlamanızı yapmadan önce bizimle iletişime geçebilirsiniz.",
      },
    ],
    faqs: [
      {
        q: "Bone kullanmak zorunlu mu?",
        a: "Evet, havuz kullanımında bone kullanılması gerekmektedir.",
      },
      {
        q: "Havuzu kullanmak için ayrıca randevu gerekir mi?",
        a: "Kullanım koşulları ve güncel program için bizimle iletişime geçebilirsiniz.",
      },
      {
        q: "Havuz sonrası ısı alanlarını kullanabilir miyim?",
        a: "Sauna ve buhar alanlarımızı havuz sonrasında kullanabilirsiniz; öncesinde duş almanız önerilir.",
      },
    ],
    related: ["sauna", "spa-masaj", "grup-dersleri"],
  },
  {
    slug: "spa-masaj",
    name: "Spa & Masaj",
    seoTitle: "Spa & Masaj | Tablo Wellness",
    seoDescription:
      "Loş masaj odalarımızda terapist eşliğinde yürütülen spa ve masaj uygulamalarımız hakkında genel bilgi.",
    hero: "Dinlenmek için ayrılmış bir zaman",
    image: "/medya/spa-masaj.webp",
    intro:
      "Spa bölümümüzde uygulamalar, loş ışıklı ve sessiz masaj odalarında terapist eşliğinde yürütülür. Amaç, günün yoğunluğundan uzaklaşabileceğiniz sakin bir aralık oluşturmaktır. Hangi uygulamanın size uygun olduğunu randevu öncesinde ekibimizle konuşarak belirleyebilirsiniz.",
    sections: [
      {
        h: "Randevu öncesi",
        p: "Randevunuzdan kısa bir süre önce tesiste olmanız hazırlık için rahat bir zaman bırakır. Tercihlerinizi, çalışılmasını istediğiniz veya istemediğiniz bölgeleri uygulama başlamadan önce paylaşmanız önerilir.",
      },
      {
        h: "Uygulama sırasında",
        p: "Basınç düzeyi ve tempo, uygulama boyunca tercihleriniz doğrultusunda ayarlanabilir. Herhangi bir aşamada değişiklik isterseniz terapiste belirtmeniz yeterlidir.",
      },
      {
        h: "Bilinmesi gerekenler",
        p: "Uygulamalar dinlenme amaçlıdır. Devam eden bir ağrınız ya da bilinen bir sağlık durumunuz varsa, randevu öncesinde kendi hekiminize danışmanız uygun olur.",
      },
    ],
    faqs: [
      {
        q: "Hangi uygulamayı seçeceğime nasıl karar veririm?",
        a: "Beklentinizi randevu sırasında paylaşmanız yeterli; ekibimiz seçenekleri anlatarak size uygun olanı birlikte belirler.",
      },
      {
        q: "Randevu almam gerekiyor mu?",
        a: "Evet, spa ve masaj uygulamaları randevu ile planlanmaktadır.",
      },
      {
        q: "Yanımda bir şey getirmeli miyim?",
        a: "Standart kullanım malzemeleri tarafımızdan sağlanır; kişisel tercihleriniz varsa getirebilirsiniz.",
      },
    ],
    related: ["sauna", "cold-plunge", "havuz"],
  },
  {
    slug: "sauna",
    name: "Sauna & Buhar",
    seoTitle: "Sauna & Buhar | Tablo Wellness",
    seoDescription:
      "Kuru ve nemli sıcaklık alanlarımızın kullanımı ile genel öneriler hakkında bilgi.",
    hero: "Isı ve buhar alanları",
    image: "/medya/sauna.webp",
    intro:
      "Islak alan bölümümüzde ısı ve buhar alanları, camlı kapılarla ayrılmış ayrı bir bölümde yer alır. Bu alanlar antrenman sonrası toparlanma rutininin bir parçası olarak tercih edilir. Süreyi kendinizi nasıl hissettiğinize göre ayarlamanız önerilir.",
    sections: [
      {
        h: "Genel kullanım önerileri",
        list: [
          "Alana girmeden önce duş almak",
          "Su tüketimine dikkat etmek",
          "Kendinizi rahat hissettiğiniz sürelerle kalmak",
          "Alan içinde sessiz bir ortamı korumak",
        ],
      },
      {
        h: "Kuru ve nemli sıcaklık",
        p: "Sauna kuru sıcaklık, buhar alanı ise nemli sıcaklık ortamı sunar. Hangisini tercih edeceğiniz tamamen kişiseldir; ikisini de deneyerek size uygun olanı belirleyebilirsiniz.",
      },
      {
        h: "Dikkat edilmesi gerekenler",
        p: "Sağlık durumunuzla ilgili bir endişeniz varsa veya düzenli ilaç kullanıyorsanız, ısı alanlarını kullanmadan önce hekiminize danışmanız uygun olur. Rahatsızlık hissettiğinizde alandan çıkmanız önerilir.",
      },
    ],
    faqs: [
      {
        q: "Sauna ile buhar alanı arasındaki fark nedir?",
        a: "Sauna kuru sıcaklık, buhar alanı ise nemli sıcaklık ortamı sunar. Tercih tamamen kişiseldir.",
      },
      {
        q: "Ne kadar süre kalmalıyım?",
        a: "Kendinizi rahat hissettiğiniz süre esastır; rahatsızlık hissettiğinizde alandan çıkmanız önerilir.",
      },
      {
        q: "Ne getirmeliyim?",
        a: "Havlu ve terlik yeterlidir; diğer ihtiyaçlarınız için ekibimize danışabilirsiniz.",
      },
    ],
    related: ["cold-plunge", "spa-masaj", "havuz"],
  },
  {
    slug: "cold-plunge",
    name: "Cold Plunge",
    seoTitle: "Cold Plunge | Tablo Wellness",
    seoDescription:
      "Ahşap fıçı tipi buz banyosu alanımızın kullanımı ve genel öneriler hakkında bilgi.",
    hero: "Soğuk suyla kısa bir mola",
    image: "/medya/cold-plunge.webp",
    intro:
      "Cold plunge alanımızda, beton duvarlı loş bir bölümde ahşap fıçı tipi buz banyosu yer alır. Soğuk su, antrenman sonrası toparlanma rutininin bir parçası olarak tercih edilir. Süreyi kendinizi nasıl hissettiğinize göre ayarlamanız önerilir.",
    sections: [
      {
        h: "Nasıl kullanılır?",
        list: [
          "Girmeden önce duş almak",
          "Suya yavaşça ve kontrollü girmek",
          "Nefesinizi sakin tutmaya çalışmak",
          "Kendinizi nasıl hissettiğinize göre süreyi ayarlamak",
        ],
      },
      {
        h: "Rutin içindeki yeri",
        p: "Cold plunge, çoğunlukla antrenman ya da ısı alanları sonrasında kullanılır. Sıralamayı ve sıklığı kendi rutininize göre belirleyebilir, tercih ettiğiniz akışı ekibimizle konuşabilirsiniz.",
      },
      {
        h: "Dikkat edilmesi gerekenler",
        p: "Soğuk suya girmek herkes için uygun olmayabilir. Sağlık durumunuzla ilgili bir endişeniz varsa veya düzenli ilaç kullanıyorsanız, alanı kullanmadan önce hekiminize danışmanız uygun olur. Rahatsızlık hissettiğinizde sudan çıkmanız önerilir.",
      },
    ],
    faqs: [
      {
        q: "Ne kadar süre kalmalıyım?",
        a: "Belirlenmiş bir süre yoktur; kendinizi nasıl hissettiğinize göre ayarlamanız önerilir.",
      },
      {
        q: "İlk kez gireceğim, nelere dikkat etmeliyim?",
        a: "Suya yavaşça girmeniz, nefesinizi sakin tutmanız ve kısa tutup rahatsızlık hissettiğinizde çıkmanız önerilir.",
      },
      {
        q: "Sauna ile birlikte kullanılabilir mi?",
        a: "İki alanı da rutininize göre sıralayabilirsiniz; tercih ettiğiniz akışı ekibimizle konuşabilirsiniz.",
      },
    ],
    related: ["sauna", "spa-masaj", "hyrox"],
  },
];

export function getService(slug: string): ServicePage | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

export function getSubServices(parentSlug: string): ServicePage[] {
  return SERVICES.filter((s) => s.parent === parentSlug);
}
