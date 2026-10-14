export interface StorySection {
  id: string;
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  scriptText: string; // The exact narrative text for TTS
  extendedText: string;
  keyInsights: { icon: string; title: string; desc: string }[];
  examples: { name: string; type: string; stat: string }[];
}

export const VOICES = [
  { id: 'Kore', name: 'Kore', gender: 'Wanita', tone: 'Hangat & Ramah (Rekomendasi)' },
  { id: 'Puck', name: 'Puck', gender: 'Pria', tone: 'Energik & Dinamis' },
  { id: 'Zephyr', name: 'Zephyr', gender: 'Wanita', tone: 'Tenang & Edukatif' },
  { id: 'Fenrir', name: 'Fenrir', gender: 'Pria', tone: 'Tegas & Berwibawa' },
  { id: 'Charon', name: 'Charon', gender: 'Pria', tone: 'Santai & Bernada Dalam' },
];

export const FULL_STORY_SCRIPT = `Kalau aplikasinya gratis, dia dapat uang dari mana? Kok bisa tetap untung?

Kamu pasti pernah mikir gitu. Dan jawabannya ternyata bukan satu, tapi ada tiga petunjuk. Kita buka satu per satu.

Petunjuk pertama: pengiklan yang bayar. Bukan kamu yang bayar, tapi iklan yang kamu lihat di dalam aplikasi itu dibayar oleh pengiklan. Makin sering kamu pakai, makin sering iklan itu tampil. Bahkan kebiasaanmu di aplikasi bisa dipakai supaya iklannya terasa lebih pas buat kamu.

Petunjuk kedua: fitur premium. Fitur dasarnya gratis, tapi yang lebih lengkap harus bayar. Misalnya tanpa iklan, penyimpanan yang lebih besar, atau akses eksklusif. Nggak semua orang upgrade, tapi yang upgrade itu yang bikin aplikasinya tetap hidup.

Petunjuk ketiga: belanja di dalam aplikasi dan kemitraan. Ada yang jual item game atau fitur tambahan, ada juga yang kerja sama dengan pihak lain, seperti afiliasi.

Jadi jawabannya: gratis buat kamu, tapi ada yang bayar. Pengiklan, pengguna premium, dan mitra.

Biar tenang, cek izin aplikasi dan kebijakan privasinya sebelum kamu pasang.

Penasaran misteri lain? Tulis di komentar!`;

export const STORY_SECTIONS: StorySection[] = [
  {
    id: 'intro',
    badge: 'Misteri Digital',
    badgeColor: 'from-amber-500 to-orange-500',
    title: 'Kalau Gratis, Untungnya dari Mana?',
    subtitle: 'Membongkar paradoks ekonomi di balik aplikasi yang kita gunakan tiap hari.',
    scriptText: `Kalau aplikasinya gratis, dia dapat uang dari mana? Kok bisa tetap untung? Kamu pasti pernah mikir gitu. Dan jawabannya ternyata bukan satu, tapi ada tiga petunjuk. Kita buka satu per satu.`,
    extendedText: `Miliaran orang menggunakan media sosial, streaming, dan aplikasi pesan setiap hari tanpa membayar sepeser pun. Namun, perusahaan di baliknya bernilai triliunan rupiah. Mari kita telusuri 3 pilar utama cara mereka mencetak profit.`,
    keyInsights: [
      {
        icon: 'HelpCircle',
        title: 'Bukan Amal Sosial',
        desc: 'Server, gaji developer, dan bandwidth berbiaya miliaran rupiah setiap bulan.',
      },
      {
        icon: 'Eye',
        title: 'Mata Uang Baru: Perhatian',
        desc: 'Waktu dan atensi yang kamu luangkan di layar adalah komoditas paling berharga di era digital.',
      },
      {
        icon: 'Layers',
        title: '3 Petunjuk Rahasia',
        desc: 'Pengiklan, pelanggan premium, dan kemitraan ekosistem.',
      },
    ],
    examples: [
      { name: 'Instagram & TikTok', type: 'Gratis 100%', stat: 'Pendapatan iklan ratusan triliun/tahun' },
      { name: 'Spotify & YouTube', type: 'Freemium', stat: 'Subsidi silang dari pelanggan berbayar' },
      { name: 'Mobile Legends & Roblox', type: 'Free-to-Play', stat: 'Monetisasi microtransaction item digital' },
    ],
  },
  {
    id: 'clue-1',
    badge: 'Petunjuk Pertama',
    badgeColor: 'from-blue-600 to-indigo-600',
    title: 'Pengiklan yang Bayar',
    subtitle: 'Bukan kamu yang bayar, tapi perhatian dan kebiasaanmu yang dihargai oleh brand.',
    scriptText: `Petunjuk pertama: pengiklan yang bayar. Bukan kamu yang bayar, tapi iklan yang kamu lihat di dalam aplikasi itu dibayar oleh pengiklan. Makin sering kamu pakai, makin sering iklan itu tampil. Bahkan kebiasaanmu di aplikasi bisa dipakai supaya iklannya terasa lebih pas buat kamu.`,
    extendedText: `Brand membayar pengembang aplikasi berdasarkan tayangan (CPM/Cost per Mille) atau klik (CPC). Algoritma aplikasi mengamati video apa yang kamu tonton lama, produk apa yang kamu cari, dan jam berapa kamu aktif—semuanya agar iklan yang muncul memiliki konversi pembelian tertinggi.`,
    keyInsights: [
      {
        icon: 'TrendingUp',
        title: 'Ekonomi Atensi (CPM & CPC)',
        desc: 'Tiap 1.000 kali banner atau video lewat di layarmu, pengiklan menyetor Rp15.000 - Rp80.000 ke platform.',
      },
      {
        icon: 'Cpu',
        title: 'Iklan Tertarget (Targeted Ads)',
        desc: 'Data usia, lokasi, dan minat memastikan kamu melihat iklan sepatu olahraga tepat saat kamu sedang gemar lari.',
      },
      {
        icon: 'ShieldAlert',
        title: '"If you aren\'t paying, you are the product"',
        desc: 'Data perilaku agregat pengguna dipaketkan untuk membantu brand menargetkan calon pembeli yang tepat.',
      },
    ],
    examples: [
      { name: 'Google Ads & Search', type: 'Mesin Pencari', stat: '80%+ pemasukan berasal dari lelang kata kunci iklan' },
      { name: 'Meta (IG & FB)', type: 'Media Sosial', stat: '97% pendapatan dari iklan bertarget berbasis minat' },
      { name: 'TikTok', type: 'Shorts Video', stat: 'Iklan native For You Page (FYP) & hashtag challenge' },
    ],
  },
  {
    id: 'clue-2',
    badge: 'Petunjuk Kedua',
    badgeColor: 'from-emerald-500 to-teal-600',
    title: 'Fitur Premium (Model Freemium)',
    subtitle: 'Fitur dasarnya gratis untuk menjaring jutaan orang, yang butuh lebih harus upgrade.',
    scriptText: `Petunjuk kedua: fitur premium. Fitur dasarnya gratis, tapi yang lebih lengkap harus bayar. Misalnya tanpa iklan, penyimpanan yang lebih besar, atau akses eksklusif. Nggak semua orang upgrade, tapi yang upgrade itu yang bikin aplikasinya tetap hidup.`,
    extendedText: `Inilah strategi "Freemium" (Free + Premium). Hukum digital 95/5: sekitar 95% pengguna menikmati versi gratis dan menciptakan efek jaringan (network effect), sementara 2-5% pengguna paling loyal atau profesional bersedia membayar langganan bulanan yang menutup semua biaya operasional.`,
    keyInsights: [
      {
        icon: 'Unlock',
        title: 'Hook Gratisan',
        desc: 'Memberikan nilai instan tanpa hambatan pendaftaran kartu kredit di awal agar orang terbiasa.',
      },
      {
        icon: 'Zap',
        title: 'Power User Upgrade',
        desc: 'Fitur tanpa iklan, download offline, cloud storage 100GB, filter eksklusif, atau resolusi 4K.',
      },
      {
        icon: 'Repeat',
        title: 'Pendapatan Berulang (MRR)',
        desc: 'Langganan Rp50.000/bulan dari 500.000 pelanggan sudah menghasilkan Rp25 Miliar per bulan.',
      },
    ],
    examples: [
      { name: 'Spotify Free vs Premium', type: 'Musik', stat: 'Bebas iklan, download offline & bebas skip lagu' },
      { name: 'Google One / iCloud', type: 'Cloud', stat: '15GB gratis; langganan bulanan untuk 100GB - 2TB' },
      { name: 'YouTube Premium', type: 'Video', stat: 'Bebas iklan & pemutaran audio di latar belakang' },
    ],
  },
  {
    id: 'clue-3',
    badge: 'Petunjuk Ketiga',
    badgeColor: 'from-purple-600 to-pink-600',
    title: 'Belanja Dalam Aplikasi & Kemitraan',
    subtitle: 'Item virtual, komisi transaksi, dan kemitraan afiliasi yang berputar senyap.',
    scriptText: `Petunjuk ketiga: belanja di dalam aplikasi dan kemitraan. Ada yang jual item game atau fitur tambahan, ada juga yang kerja sama dengan pihak lain, seperti afiliasi.`,
    extendedText: `Game gratis meraup keuntungan gila-gilaan dari penjualan kosmetik virtual (skin, gacha, battle pass) yang secara fisik tidak memerlukan biaya bahan baku. Selain itu, aplikasi produktivitas dan media sosial mendapatkan komisi persentase setiap kali pengguna membeli barang melalui tautan afiliasi mereka.`,
    keyInsights: [
      {
        icon: 'ShoppingBag',
        title: 'Microtransactions (In-App Purchases)',
        desc: 'Beli skin karakter Rp20.000 terasa kecil, tapi jika 1 juta pemain membelinya, tercipta Rp20 Miliar seketika.',
      },
      {
        icon: 'Percent',
        title: 'Komisi Platform (Take Rate)',
        desc: 'Toko aplikasi & e-commerce memotong 5% hingga 30% dari setiap pembayaran atau penjualan tiket pihak ketiga.',
      },
      {
        icon: 'Link',
        title: 'Afiliasi & Referral',
        desc: 'Mengarahkan pengguna ke hotel, pinjaman, asuransi, atau toko online dan mendapat bagi hasil komisi.',
      },
    ],
    examples: [
      { name: 'Mobile Legends & Free Fire', type: 'Game Mobile', stat: 'Skin hero, diamond, starlight pass' },
      { name: 'Gojek & Grab', type: 'Super App', stat: 'Komisi resto & merchant mitra 15-20% per pesanan' },
      { name: 'TikTok Shop & Shopee', type: 'Social Commerce', stat: 'Komisi afiliasi kreator & biaya transaksi' },
    ],
  },
  {
    id: 'conclusion',
    badge: 'Kesimpulan & Keamanan',
    badgeColor: 'from-amber-600 to-rose-600',
    title: 'Gratis Buat Kamu, Ada yang Bayar',
    subtitle: 'Tips cerdas mengecek izin aplikasi dan kebijakan privasi sebelum mengunduh.',
    scriptText: `Jadi jawabannya: gratis buat kamu, tapi ada yang bayar. Pengiklan, pengguna premium, dan mitra. Biar tenang, cek izin aplikasi dan kebijakan privasinya sebelum kamu pasang. Penasaran misteri lain? Tulis di komentar!`,
    extendedText: `Tidak ada yang benar-benar 100% cuma-cuma di internet. Mengetahui siapa yang membayar memberi kita kesadaran untuk menjaga privasi. Selalu waspada terhadap aplikasi sederhana (seperti kalkulator atau senter) yang meminta izin kontak atau mikrofon!`,
    keyInsights: [
      {
        icon: 'CheckCircle',
        title: '3 Sumber Pendana',
        desc: 'Pengiklan + Pelanggan Premium + Mitra Transaksi Bisnis.',
      },
      {
        icon: 'Lock',
        title: 'Audit Izin Aplikasi',
        desc: 'Hanya izinkan akses lokasi saat aplikasi digunakan (While using the app), tolak akses kontak jika tidak relevan.',
      },
      {
        icon: 'MessageSquare',
        title: 'Diskusi & Komentar',
        desc: 'Punya rasa penasaran tentang algoritma, kuota data, atau monetisasi digital lainnya? Tanyakan langsung!',
      },
    ],
    examples: [
      { name: 'Audit Izin Kamera & Mic', type: 'Privasi', stat: 'Pastikan indikator titik hijau/oranye tidak menyala liar' },
      { name: 'Batasi Pelacakan Iklan', type: 'Pengaturan OS', stat: 'Matikan "Personalized Ads" atau reset Advertising ID' },
      { name: 'Baca Ringkasan Izin', type: 'Play Store / App Store', stat: 'Cek "Data Safety Section" sebelum install' },
    ],
  },
];

export const PRIVACY_CHECKLIST = [
  {
    id: 'camera',
    title: 'Akses Kamera & Mikrofon',
    typicalReason: 'Untuk video call, scan QR, foto profil, voice note.',
    risk: 'Tinggi',
    tip: 'Wajar untuk aplikasi chat & kamera. Sangat mencurigakan jika diminta aplikasi kalkulator, game offline, atau kompas.',
  },
  {
    id: 'location',
    title: 'Lokasi Presisi vs Perkiraan',
    typicalReason: 'Navigasi ojek online, cuaca lokal, penandaan tempat.',
    risk: 'Tinggi',
    tip: 'Pilih "Hanya saat aplikasi dibuka" (While Using the App). Jangan pernah beri izin "Selalu" (Always) kecuali aplikasi peta navigasi.',
  },
  {
    id: 'contacts',
    title: 'Akses Buku Kontak',
    typicalReason: 'Mencari teman yang sudah terdaftar di aplikasi.',
    risk: 'Sedang-Tinggi',
    tip: 'Sering dipakai pinjol ilegal atau scraper nomor WhatsApp. Jika ragu, tambahkan teman manual tanpa beri izin seluruh buku kontak.',
  },
  {
    id: 'storage',
    title: 'Penyimpanan & Galeri Foto',
    typicalReason: 'Upload foto atau simpan unduhan file.',
    risk: 'Sedang',
    tip: 'Gunakan fitur "Pilih Foto Tertentu" di Android 14+ / iOS ketimbang memberi izin ke seluruh isi galeri pribadi.',
  },
  {
    id: 'tracking',
    title: 'Pelacakan Lintas Aplikasi (Ad ID)',
    typicalReason: 'Menghubungkan aktivitas browsing dengan iklan yang relevan.',
    risk: 'Sedang',
    tip: 'Bisa dimatikan di pengaturan HP: Pengaturan > Privasi > Iklan > Hapus Advertising ID / Ask App not to Track.',
  },
];

export const PRESET_MYSTERIES = [
  'Kenapa game gratis sering memaksa kita nonton video iklan 30 detik?',
  'Apakah HP kita diam-diam mendengarkan obrolan kita untuk target iklan?',
  'Dari mana WhatsApp dapat untung padahal tidak ada iklannya?',
  'Kenapa penyimpanan gratis Google Drive dibatasi 15 GB?',
  'Apa itu cookies di browser dan kenapa web selalu minta persetujuan?',
];
