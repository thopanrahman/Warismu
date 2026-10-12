// Data mock artikel panduan faraid (nanti diganti API backend)
export const daftarPanduan = [
  {
    id: 1,
    judul: 'Apa itu Faraid? Pengantar Ilmu Waris Islam',
    kategori: 'Dasar',
    estimasi: '5 mnt baca',
    tanggal: '12 Okt 2026',
    gambar:
      'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=800&q=80',
    ringkasan:
      'Mengenal pengertian faraid, dasar hukumnya dalam Al-Qur’an, dan mengapa setiap Muslim perlu memahaminya.',
    isi: [
      'Faraid adalah ilmu yang mempelajari ketentuan pembagian harta peninggalan (tirkah) seseorang yang telah wafat kepada ahli warisnya sesuai syariat Islam. Kata faraid berasal dari kata fard yang berarti ketetapan atau kewajiban.',
      'Dasar hukum faraid bersumber dari Al-Qur’an, terutama QS. An-Nisa ayat 11, 12, dan 176, serta hadis-hadis Nabi Muhammad SAW. Di Indonesia, ketentuan ini juga diakomodasi dalam Kompilasi Hukum Islam (KHI).',
      'Mempelajari faraid hukumnya fardu kifayah — artinya jika sudah ada yang mempelajarinya di suatu komunitas, gugurlah kewajiban bagi yang lain. Namun memahami dasar-dasarnya sangat dianjurkan agar tidak terjadi sengketa keluarga.',
    ],
    poin: [
      'Faraid = ketentuan bagian pasti (furudh) bagi ahli waris',
      'Sumber utama: QS. An-Nisa ayat 11, 12, dan 176',
      'Di Indonesia diatur juga dalam Kompilasi Hukum Islam (KHI)',
      'Mempelajarinya hukumnya fardu kifayah',
    ],
    sumber: 'QS. An-Nisa: 11–12, 176; Kompilasi Hukum Islam Buku II',
  },
  {
    id: 2,
    judul: 'Siapa Saja Ahli Waris? Mengenal Ashabul Furudh',
    kategori: 'Dasar',
    estimasi: '7 mnt baca',
    tanggal: '10 Okt 2026',
    gambar:
      'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80',
    ringkasan:
      'Daftar kerabat yang berhak menerima warisan beserta bagian pastinya: suami, istri, ayah, ibu, anak, dan lainnya.',
    isi: [
      'Ashabul furudh adalah ahli waris yang bagiannya sudah ditentukan secara pasti dalam nash (Al-Qur’an dan hadis). Mereka didahulukan sebelum sisa harta (ashabah) dibagikan.',
      'Contoh bagian pasti: suami mendapat 1/2 jika tidak ada anak dan 1/4 jika ada anak; istri mendapat 1/4 jika tidak ada anak dan 1/8 jika ada anak; ibu mendapat 1/3 jika tidak ada anak dan 1/6 jika ada anak.',
      'Tidak semua kerabat otomatis menjadi ahli waris. Ada yang terhijab (terhalang) oleh kerabat yang lebih dekat, misalnya cucu terhijab oleh anak laki-laki.',
    ],
    poin: [
      'Suami: 1/2 (tanpa anak) atau 1/4 (dengan anak)',
      'Istri: 1/4 (tanpa anak) atau 1/8 (dengan anak)',
      'Ibu: 1/3 (tanpa anak) atau 1/6 (dengan anak)',
      'Ayah: 1/6 + sisa (dengan anak lk/pr) atau sisa penuh',
      'Konsep hijab: kerabat dekat menghalangi yang jauh',
    ],
    sumber: 'QS. An-Nisa: 11–12; KHI Pasal 174–175',
  },
  {
    id: 3,
    judul: 'Bagian Anak: Memahami Prinsip 2 banding 1',
    kategori: 'Ahli Waris',
    estimasi: '6 mnt baca',
    tanggal: '8 Okt 2026',
    gambar:
      'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80',
    ringkasan:
      'Mengapa anak laki-laki mendapat dua kali bagian anak perempuan, dan dalam kondisi apa anak menjadi ashabah.',
    isi: [
      'QS. An-Nisa ayat 11 menetapkan bahwa bagian seorang anak laki-laki sama dengan bagian dua orang anak perempuan. Ketentuan ini berlaku ketika anak laki-laki dan perempuan berkumpul sebagai ahli waris.',
      'Hikmahnya antara lain karena laki-laki memikul kewajiban nafkah terhadap keluarga, sedangkan perempuan tidak dibebani kewajiban tersebut dan tetap berhak atas hartanya sendiri.',
      'Jika hanya ada anak perempuan (tanpa anak laki-laki): satu orang anak perempuan mendapat 1/2, dua orang atau lebih mendapat 2/3 bersama. Jika hanya anak laki-laki, mereka menjadi ashabah (menghabiskan sisa).',
    ],
    poin: [
      'Anak lk : anak pr = 2 : 1 (saat berkumpul)',
      '1 anak pr saja = 1/2; 2+ anak pr = 2/3 bersama',
      'Anak lk saja = ashabah (mengambil sisa)',
      'Dasar: QS. An-Nisa ayat 11',
    ],
    sumber: 'QS. An-Nisa: 11; KHI Pasal 176–177',
  },
  {
    id: 4,
    judul: 'Hak Suami & Istri dalam Pembagian Warisan',
    kategori: 'Ahli Waris',
    estimasi: '5 mnt baca',
    tanggal: '5 Okt 2026',
    gambar:
      'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80',
    ringkasan:
      'Rincian bagian pasangan yang ditinggalkan, perbedaan suami dan istri, serta pengaruh keberadaan anak.',
    isi: [
      'Pasangan (suami/istri) adalah ahli waris yang tidak pernah terhijab sepenuhnya — selama perkawinan sah, mereka selalu mendapat bagian.',
      'Suami mendapat 1/2 jika istrinya wafat tanpa anak, dan 1/4 jika ada anak (termasuk anak dari pernikahan lain). Istri mendapat 1/4 jika suami wafat tanpa anak, dan 1/8 jika ada anak.',
      'Jika istri lebih dari satu (poligami yang sah), bagian 1/4 atau 1/8 tersebut dibagi rata di antara para istri.',
    ],
    poin: [
      'Suami: 1/2 tanpa anak, 1/4 dengan anak',
      'Istri: 1/4 tanpa anak, 1/8 dengan anak',
      'Pasangan tidak pernah gugur total (selalu dapat bagian)',
      'Bagian para istri (poligami) dibagi rata',
    ],
    sumber: 'QS. An-Nisa: 12; KHI Pasal 175, 179',
  },
  {
    id: 5,
    judul: 'Urutan Pembagian: Hutang, Wasiat, lalu Waris',
    kategori: 'Prosedur',
    estimasi: '6 mnt baca',
    tanggal: '2 Okt 2026',
    gambar:
      'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80',
    ringkasan:
      'Harta tidak langsung dibagi! Lunasi dulu biaya pengurusan jenazah, hutang, dan wasiat sebelum faraid dihitung.',
    isi: [
      'Sebelum harta dibagi kepada ahli waris, ada tiga kewajiban yang harus ditunaikan terlebih dahulu dari harta peninggalan (tirkah): biaya pengurusan jenazah, pelunasan hutang pewaris, dan pelaksanaan wasiat.',
      'Wasiat maksimal 1/3 dari harta dan tidak boleh ditujukan kepada ahli waris (kecuali disetujui semua ahli waris). Ini sesuai hadis riwayat Bukhari dan Muslim tentang wasiat Sa’ad bin Abi Waqqash.',
      'Baru setelah ketiganya beres, sisa harta (warisan murni) dibagi menurut faraid. Kesalahan umum masyarakat adalah langsung membagi tanpa melunasi hutang pewaris.',
    ],
    poin: [
      'Urutan: jenazah → hutang → wasiat → waris',
      'Wasiat maksimal 1/3 harta',
      'Wasiat untuk ahli waris butuh persetujuan semua ahli waris',
      'Hutang pewaris wajib dilunasi dari tirkah',
    ],
    sumber: 'QS. An-Nisa: 11–12; HR. Bukhari & Muslim',
  },
  {
    id: 6,
    judul: 'Harta Bersama vs Harta Warisan: Jangan Tertukar!',
    kategori: 'Prosedur',
    estimasi: '5 mnt baca',
    tanggal: '28 Sep 2026',
    gambar:
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
    ringkasan:
      'Dalam konteks Indonesia, pisahkan dulu harta bersama (gono-gini) sebelum menghitung warisan pasangan yang wafat.',
    isi: [
      'Harta bersama adalah harta yang diperoleh selama perkawinan. Menurut KHI, jika salah satu pasangan wafat, harta bersama dibagi dua terlebih dahulu: separuh untuk pasangan yang hidup, separuh menjadi tirkah pewaris.',
      'Harta bawaan (diperoleh sebelum menikah, hibah, atau warisan pribadi) tidak termasuk harta bersama dan langsung menjadi tirkah.',
      'Setelah tirkah jelas (separuh harta bersama + harta bawaan pewaris), barulah dihitung hutang, wasiat, lalu faraid.',
    ],
    poin: [
      'Harta bersama dibagi 2 dulu (pasangan hidup + tirkah)',
      'Harta bawaan langsung masuk tirkah',
      'Dasar: KHI Pasal 85–97 (harta bersama)',
      'Tirkah = dasar perhitungan faraid',
    ],
    sumber: 'KHI Pasal 85–97, 171–172',
  },
  {
    id: 7,
    judul: 'Hijab & Mahjub: Saat Kerabat Terhalang Menerima Waris',
    kategori: 'Lanjutan',
    estimasi: '8 mnt baca',
    tanggal: '25 Sep 2026',
    gambar:
      'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?auto=format&fit=crop&w=800&q=80',
    ringkasan:
      'Konsep penghalang (hijab) dalam faraid: siapa menghalangi siapa, dan bedanya hijab hirman vs hijab nuqshan.',
    isi: [
      'Hijab adalah terhalangnya seseorang dari warisan (seluruhnya atau sebagian) karena adanya ahli waris lain yang lebih dekat dengan pewaris. Ada dua jenis: hijab hirman (gugur total) dan hijab nuqshan (berkurang bagiannya).',
      'Contoh hijab hirman: cucu (anak dari anak laki-laki) terhijab oleh anak laki-laki; saudara kandung terhijab oleh anak laki-laki dan ayah. Contoh hijab nuqshan: suami dari 1/2 menjadi 1/4 karena adanya anak.',
      'Memahami hijab mencegah kesalahan memasukkan kerabat yang sebenarnya tidak berhak, yang merupakan sumber sengketa paling umum.',
    ],
    poin: [
      'Hijab hirman = gugur total; hijab nuqshan = berkurang',
      'Anak lk menghijab cucu & saudara',
      'Ayah menghijab kakek & saudara',
      'Pasangan & orang tua & anak tidak pernah terhijab total',
    ],
    sumber: 'Kitab-kitab faraid; KHI Pasal 174',
  },
  {
    id: 8,
    judul: 'Simulasi & Konsultasi via Chatbot: Cara Pakai WarisMu',
    kategori: 'Tutorial',
    estimasi: '4 mnt baca',
    tanggal: '20 Sep 2026',
    gambar:
      'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80',
    ringkasan:
      'Panduan memakai fitur konsultasi WarisMu: bercerita dalam bahasa natural, lengkapi data, terima hasil simulasi.',
    isi: [
      'WarisMu dirancang conversational: kamu cukup bercerita, misalnya “Ayah saya wafat, meninggalkan ibu, istri, 1 anak laki-laki dan 2 anak perempuan, harta Rp500 juta”. Sistem akan mengekstraksi data keluarga dari ceritamu.',
      'Jika ada data yang kurang (misalnya hutang pewaris atau status harta bersama), chatbot akan bertanya hingga data lengkap. Kamu bisa menjawab santai seperti mengobrol.',
      'Hasilnya berupa tabel bagian tiap ahli waris lengkap dengan dalil, penjelasan, dan disclaimer. Guest bisa mencoba tanpa login; daftar akun untuk menyimpan riwayat konsultasi.',
    ],
    poin: [
      'Langkah 1: ceritakan kondisi keluarga (bahasa natural)',
      'Langkah 2: jawab pertanyaan pelengkap dari chatbot',
      'Langkah 3: terima tabel hasil + dalil + disclaimer',
      'Guest: tanpa login (riwayat hilang saat browser ditutup)',
    ],
    sumber: 'Dokumentasi produk WarisMu (SRS & SDD)',
  },
]

export const daftarKategori = ['Semua', 'Dasar', 'Ahli Waris', 'Prosedur', 'Lanjutan', 'Tutorial']
