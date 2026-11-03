// Data artikel Pustaka Faraid.
// Semua gambar memakai aset lokal di public/images/panduan/ (bukan hotlink),
// agar tidak rusak ketika CDN pihak ketiga berubah.
// Konten diringkas dari buku "Fikih Faraidh: Teknik Penyelesaian Kasus Waris"
// (Dr. Khairuddin, M.Ag) dan dilengkapi rujukan KHI.

export const penulisPanduan = {
  nama: 'Dr. Khairuddin, M.Ag',
  jabatan: 'Dosen Fakultas Syari’ah UIN Ar-Raniry',
  deskripsi:
    'Penulis buku “Fikih Faraidh: Teknik Penyelesaian Kasus Waris” (Sahifah, 2020). Buku ini menawarkan metode praktis penentuan asal masalah dan langkah penyelesaian kasus waris untuk mahasiswa maupun masyarakat umum.',
}

export const daftarPanduan = [
  {
    id: 1,
    judul: 'Apa Itu Faraid? Pengertian dan Dasar Hukumnya',
    kategori: 'Dasar',
    estimasi: '6 mnt baca',
    tanggal: '12 Okt 2026',
    penulis: 'Dr. Khairuddin, M.Ag',
    gambarCover: '/images/panduan/01-dasar-hukum.jpg',
    ringkasan:
      'Mengenal pengertian ilmu faraid, istilah dasarnya, dan dalil-dalil yang menjadi landasan pembagian warisan dalam Islam.',
    arab: {
      teks: 'يُوصِيكُمُ اللَّهُ فِي أَوْلَادِكُمْ ۖ لِلذَّكَرِ مِثْلُ حَظِّ الْأُنثَيَيْنِ',
      terjemahan:
        'Allah mensyariatkan (mewajibkan) kepadamu tentang (pembagian warisan untuk) anak-anakmu, yaitu bagian seorang anak laki-laki sama dengan bagian dua anak perempuan. (QS. An-Nisa’: 11)',
    },
    isi: [
      'Faraid adalah ilmu yang membahas perpindahan harta peninggalan (tirkah) seseorang yang telah wafat kepada para ahli warisnya, beserta besar bagian masing-masing sesuai ketetapan syariat. Kata faraid berasal dari fardh yang berarti ketetapan atau kewajiban, karena bagian ahli waris ditetapkan langsung oleh nash, bukan hasil kesepakatan keluarga.',
      'Dalam kajian faraid dikenal tiga istilah pokok: muwarits (orang yang wafat dan meninggalkan harta), warits (ahli waris yang berhak menerima), serta tirkah atau mauruts (harta yang ditinggalkan). Ketiga unsur ini harus jelas sebelum perhitungan dimulai, karena kesalahan mengenali salah satunya akan membuat seluruh pembagian keliru.',
      'Dasar hukumnya bersumber dari Al-Qur’an, terutama QS. An-Nisa’ ayat 7, 11, 12, dan 176, kemudian dijelaskan oleh sunah Nabi Muhammad saw. melalui banyak hadis praktis. Para ulama sepakat bahwa mempelajari faraid hukumnya fardhu kifayah: gugur kewajiban komunitas bila sudah ada yang menguasainya, tetapi memahami dasar-dasarnya tetap sangat dianjurkan bagi setiap keluarga muslim.',
      'Di Indonesia, ketentuan faraid diakomodasi dalam Kompilasi Hukum Islam (KHI) Buku II Pasal 171–193 dan menjadi salah satu perkara yang diperiksa Pengadilan Agama. Karena itu, ilmu ini bukan sekadar wacana kajian, melainkan rujukan hukum yang hidup di masyarakat.',
    ],
    poin: [
      'Faraid = bagian pasti (furudh) yang ditetapkan nash, bukan hasil musyawarah',
      'Tiga unsur utama: muwarits, warits, dan tirkah',
      'Sumber utama: QS. An-Nisa’ ayat 7, 11, 12, dan 176',
      'Hukum mempelajari: fardhu kifayah',
      'Di Indonesia diatur dalam KHI Buku II Pasal 171–193',
    ],
    sumber: 'QS. An-Nisa’: 7, 11, 12, 176; KHI Buku II',
  },
  {
    id: 2,
    judul: 'Rukun, Syarat, dan Sebab Seseorang Mewarisi',
    kategori: 'Dasar',
    estimasi: '7 mnt baca',
    tanggal: '9 Okt 2026',
    penulis: 'Dr. Khairuddin, M.Ag',
    gambarCover: '/images/panduan/02-rukun-waris.jpg',
    ringkasan:
      'Warisan tidak otomatis berpindah. Ada rukun, syarat, dan sebab yang harus terpenuhi lebih dulu, serta penghalang yang membatalkannya.',
    arab: {
      teks: 'لِّلرِّجَالِ نَصِيبٌ مِّمَّا تَرَكَ الْوَالِدَانِ وَالْأَقْرَبُونَ وَلِلنِّسَاءِ نَصِيبٌ مِّمَّا تَرَكَ الْوَالِدَانِ وَالْأَقْرَبُونَ',
      terjemahan:
        'Bagi laki-laki ada hak bagian dari harta peninggalan kedua orang tua dan kerabatnya, dan bagi perempuan ada hak bagian (pula) dari harta peninggalan kedua orang tua dan kerabatnya. (QS. An-Nisa’: 7)',
    },
    isi: [
      'Rukun waris ada tiga: adanya muwarits yang benar-benar wafat, adanya warits yang masih hidup saat kematian tersebut, dan adanya tirkah atau harta yang ditinggalkan. Bila salah satu rukun tidak terpenuhi, tidak ada pembagian warisan yang sah.',
      'Syarat mewarisi melengkapi rukun tersebut. Pewaris harus dinyatakan wafat secara hakiki atau secara hukum (misalnya lewat putusan pengadilan atas orang yang hilang), ahli waris harus hidup ketika pewaris wafat termasuk bayi yang lahir hidup, hubungan kekerabatan atau perkawinan harus diketahui secara pasti, dan tidak boleh ada penghalang syar’i di antara keduanya.',
      'Sebab seseorang menerima warisan ada tiga: hubungan nasab (kekerabatan), pernikahan yang sah, dan wala’ (hubungan bekas hamba yang dimerdekakan). KHI menambahkan wasiat wajibah sebagai jalan memberi bagian kepada anak angkat atau orang tua angkat, meski secara fikih klasik wasiat wajibah bukan sebab waris dalam arti sesungguhnya.',
      'Ada pula penghalang yang menggugurkan hak waris: membunuh pewaris, berbeda agama, dan perbudakan. KHI Pasal 173 menegaskan penghalang serupa, termasuk upaya memfitnah atau memaksa pewaris agar mengubah wasiat. Memeriksa penghalang ini sebelum menghitung bagian adalah langkah yang sering terlewat.',
    ],
    poin: [
      'Rukun: muwarits, warits, dan tirkah',
      'Ahli waris harus hidup saat pewaris wafat',
      'Sebab waris: nasab, pernikahan sah, dan wala’',
      'Penghalang: membunuh, beda agama, perbudakan (KHI Pasal 173)',
    ],
    sumber: 'QS. An-Nisa’: 7; KHI Pasal 171–173',
  },
  {
    id: 3,
    judul: 'Ahli Waris dan Bagiannya: Zawil Furudh, Ashabah, dan Zawil Arham',
    kategori: 'Ahli Waris',
    estimasi: '8 mnt baca',
    tanggal: '6 Okt 2026',
    penulis: 'Dr. Khairuddin, M.Ag',
    gambarCover: '/images/panduan/03-ahli-waris.jpg',
    ringkasan:
      'Peta lengkap golongan ahli waris: 12 penerima bagian pasti, kelompok penerima sisa, dan kerabat jalur ibu.',
    isi: [
      'Zawil furudh adalah ahli waris yang bagiannya telah ditentukan nash. Jumlahnya dua belas golongan: empat dari pihak laki-laki (suami, ayah, kakek sahih, dan saudara seibu) serta delapan dari pihak perempuan (istri, ibu, nenek, anak perempuan, cucu perempuan dari anak laki-laki, saudara perempuan sekandung, saudara perempuan seayah, dan saudara perempuan seibu).',
      'Bagian pasti yang dikenal ada enam macam: 1/2, 1/4, 1/8, 2/3, 1/3, dan 1/6. Contoh yang paling sering dipakai: suami memperoleh 1/2 bila tidak ada anak dan 1/4 bila ada anak; istri memperoleh 1/4 tanpa anak dan 1/8 dengan anak; ibu memperoleh 1/3 tanpa anak dan 1/6 dengan anak; ayah memperoleh 1/6 bila ada anak dan menerima sisa bila tidak ada anak.',
      'Ashabah adalah ahli waris yang menerima sisa harta setelah zawil furudh diambil. Ashabah binafsihi terdiri dari anak laki-laki, cucu laki-laki, ayah, kakek, dan saudara laki-laki; ashabah bilghair timbul ketika perempuan menjadi ashabah bersama laki-laki (misalnya anak perempuan bersama anak laki-laki dengan perbandingan 2:1); sedangkan ashabah ma’al ghair adalah perempuan yang menerima sisa bersama perempuan lain, seperti saudara perempuan sekandung bersama anak perempuan.',
      'Zawil arham adalah kerabat yang bukan zawil furudh dan bukan ashabah, seperti cucu dari anak perempuan, bibi, atau anak saudara perempuan. Dalam praktik di Indonesia, KHI Pasal 185 membuka jalan bagi ahli waris pengganti, sehingga kerabat jalur yang lebih jauh tidak selalu kosong dari hak.',
    ],
    poin: [
      'Zawil furudh: 12 golongan dengan bagian pasti',
      'Enam bentuk furudh: 1/2, 1/4, 1/8, 2/3, 1/3, 1/6',
      'Ashabah: binafsihi, bilghair, dan ma’al ghair',
      'Zawil arham dapat memperoleh bagian lewat ketentuan KHI',
    ],
    sumber: 'QS. An-Nisa’: 11–12, 176; KHI Pasal 176–185',
  },
  {
    id: 4,
    judul: 'Hijab: Saat Kerabat Terhalang Menerima Warisan',
    kategori: 'Lanjutan',
    estimasi: '6 mnt baca',
    tanggal: '3 Okt 2026',
    penulis: 'Dr. Khairuddin, M.Ag',
    gambarCover: '/images/panduan/04-hijab.jpg',
    ringkasan:
      'Mengenal dua jenis penghalang waris: karena sifat pada diri ahli waris, dan karena kehadiran kerabat yang lebih dekat.',
    isi: [
      'Hijab berarti penghalang yang membuat seseorang tidak menerima warisan, baik seluruhnya maupun sebagian. Dalam faraid, hijab dibedakan dari mahjub: hijab adalah penghalangnya, sedangkan mahjub adalah pihak yang terhalang.',
      'Hijab washfi berkaitan dengan sifat pada diri ahli waris, seperti membunuh pewaris, berbeda agama, atau berstatus hamba sahaya. Penghalang jenis ini bersifat tetap dan tidak berubah oleh susunan keluarga.',
      'Hijab syakhsy timbul karena adanya ahli waris lain yang lebih dekat. Jenis ini terbagi dua: hijab nuqshan yang hanya mengurangi bagian — misalnya suami turun dari 1/2 menjadi 1/4 karena ada anak — dan hijab hirman yang menggugurkan hak sepenuhnya, misalnya cucu terhalang oleh anak laki-laki, atau saudara terhalang oleh anak laki-laki dan ayah.',
      'Ada golongan yang tidak pernah terhijab hirman: pasangan, orang tua, dan anak. Mereka paling banyak hanya mengalami pengurangan bagian. Memahami peta hijab ini mencegah kesalahan paling umum, yaitu memasukkan kerabat yang sebenarnya sudah gugur haknya.',
    ],
    poin: [
      'Hijab washfi: halangan karena sifat (membunuh, beda agama)',
      'Hijab syakhsy: halangan karena ahli waris lain lebih dekat',
      'Nuqshan mengurangi bagian, hirman menggugurkan hak',
      'Pasangan, orang tua, dan anak tidak pernah terhijab hirman',
    ],
    sumber: 'Kitab-kitab faraid; KHI Pasal 174',
  },
  {
    id: 5,
    judul: 'Cara Menentukan Asal Masalah dalam Hitungan Waris',
    kategori: 'Perhitungan',
    estimasi: '7 mnt baca',
    tanggal: '30 Sep 2026',
    penulis: 'Dr. Khairuddin, M.Ag',
    gambarCover: '/images/panduan/05-asal-masalah.jpg',
    ringkasan:
      'Asal masalah adalah kunci perhitungan: cari kelipatan penyebut terkecil, lalu ubah setiap bagian menjadi saham.',
    isi: [
      'Asal masalah (AM) adalah bilangan penyebut bersama yang dipakai untuk menyamakan semua bagian ahli waris. Secara sederhana, AM adalah kelipatan persekutuan terkecil dari penyebut bagian yang ada. Bila ahli waris terdiri dari suami (1/4), ibu (1/6), dan anak perempuan (1/2), maka AM-nya 12.',
      'Ulama klasik merumuskan empat kaidah hubungan antarpenyebut: tamatsul (penyebut sama, AM memakai salah satunya), tadakhul (penyebut terbesar kelipatan yang lain, AM memakai yang terbesar), tawafuq (keduanya punya faktor pembagi bersama), dan tabayun (tidak punya faktor bersama sehingga penyebut dikalikan).',
      'Buku ini menawarkan cara yang lebih praktis: ambil penyebut terbesar, lalu kalikan dengan 1, 2, atau 3 sampai habis dibagi seluruh penyebut lain. Cara ini cukup untuk kasus rumah tangga sehari-hari dan mengurangi kekeliruan hitung bagi pemula.',
      'Setelah AM ditetapkan, langkah penyelesaian berjalan berurutan: tunaikan hak sebelum waris (harta bersama, biaya jenazah, hutang, wasiat), data semua ahli waris, tentukan penghalang dan ashabah, tetapkan AM, hitung saham setiap ahli waris, lalu kalikan saham dengan nilai tirkah. Tanpa urutan ini, angka sering benar tetapi dasar perhitungannya salah.',
    ],
    poin: [
      'AM = penyebut bersama (KPK) dari semua bagian',
      'Kaidah klasik: tamatsul, tadakhul, tawafuq, tabayun',
      'Cara praktis: kalikan penyebut terbesar dengan 1, 2, atau 3',
      'Urutan: hak sebelum waris, data ahli waris, AM, saham, nilai rupiah',
    ],
    sumber: 'Buku Fikih Faraidh bab IV; QS. An-Nisa’: 11–12',
  },
  {
    id: 6,
    judul: 'Aul: Ketika Jumlah Bagian Melebihi Harta',
    kategori: 'Perhitungan',
    estimasi: '5 mnt baca',
    tanggal: '27 Sep 2026',
    penulis: 'Dr. Khairuddin, M.Ag',
    gambarCover: '/images/panduan/06-aul.jpg',
    ringkasan:
      'Aul terjadi saat total bagian ahli waris melampaui asal masalah. Penyelesaiannya bukan memotong satu ahli waris, melainkan menaikkan asal masalah.',
    isi: [
      'Aul adalah keadaan ketika jumlah bagian para ahli waris melebihi asal masalah, sehingga harta tidak cukup untuk memenuhi semua bagian yang telah ditetapkan nash. Kondisi ini tidak berarti ada bagian yang batal, tetapi penyebutnya dinaikkan agar seluruh bagian tetap terbagi proporsional.',
      'Contoh klasik: ahli waris terdiri dari suami, ibu, ayah, dan dua anak perempuan. Suami 1/4, ibu 1/6, ayah 1/6, dan dua anak perempuan 2/3. Dengan AM 12, sahamnya 3 + 2 + 2 + 8 = 15, melebihi AM. Asal masalah dinaikkan menjadi 15 sehingga setiap saham bernilai 1/15 dari tirkah.',
      'Masalah aul tidak muncul pada masa Rasulullah saw. dan Abu Bakar, karena kasusnya baru terjadi kemudian. Penyelesaiannya merupakan ijtihad Umar bin Khattab bersama para sahabat, dan sampai hari ini diikuti mayoritas ulama serta diadopsi KHI Pasal 192.',
      'Yang perlu dijaga: aul hanya berlaku pada kasus yang benar-benar mengalami kelebihan saham. Sebelum menyimpulkan aul, pastikan tidak ada ahli waris yang seharusnya terhijab atau tidak ada ashabah yang seharusnya menutup sisa.',
    ],
    poin: [
      'Aul = total saham melebihi asal masalah',
      'Penyelesaian: naikkan asal masalah, bukan memotong hak',
      'Contoh: AM 12 menjadi 15 pada kasus suami, ibu, ayah, dua anak perempuan',
      'Dasar praktik: ijtihad Umar bin Khattab; KHI Pasal 192',
    ],
    sumber: 'Buku Fikih Faraidh bab V; KHI Pasal 192',
  },
  {
    id: 7,
    judul: 'Radd: Mengembalikan Sisa Harta kepada Ahli Waris',
    kategori: 'Perhitungan',
    estimasi: '5 mnt baca',
    tanggal: '24 Sep 2026',
    penulis: 'Dr. Khairuddin, M.Ag',
    gambarCover: '/images/panduan/07-radd.jpg',
    ringkasan:
      'Kebalikan aul: harta bersisa karena tidak ada ashabah. Sisa itu dikembalikan kepada penerima bagian pasti, dengan beberapa pengecualian.',
    isi: [
      'Radd adalah mengembalikan sisa harta kepada ahli waris zawil furudh nasabiyah ketika bagian-bagian mereka telah diambil dan tidak ada ashabah yang menerima sisa. Tanpa radd, harta akan menganggur atau diserahkan ke baitul mal.',
      'Rukun radd ada tiga: adanya harta sisa setelah pembagian bagian pasti, adanya ahli waris penerima bagian pasti dari jalur nasab, dan tidak adanya ashabah yang menutup sisa tersebut. Bila salah satu tidak terpenuhi, radd tidak berlaku.',
      'Ulama berbeda pendapat. Zaid bin Tsabit menolak radd dan menyerahkan sisa kepada baitul mal, sedangkan jumhur ulama membolehkannya karena lebih dekat kepada tujuan keadilan dan kemaslahatan ahli waris. Dalam praktik Indonesia, KHI Pasal 193 memilih jalan radd, sehingga sisa dibagikan kepada ahli waris yang berhak.',
      'Perlu dicatat, pasangan (suami atau istri) tidak menerima bagian radd menurut pendapat yang mu’tamad; sisa diberikan kepada ahli waris nasab. Bila hanya pasangan yang tersisa, penyelesaiannya dikembalikan kepada ketentuan yang berlaku, termasuk kemungkinan penyerahan kepada baitul mal atau kebijakan pengadilan.',
    ],
    poin: [
      'Radd = mengembalikan sisa harta kepada zawil furudh nasabiyah',
      'Rukun: ada sisa, ada penerima furudh nasab, tidak ada ashabah',
      'Zaid bin Tsabit menolak; jumhur membolehkan',
      'KHI Pasal 193 memakai jalan radd',
      'Pasangan tidak menerima bagian radd',
    ],
    sumber: 'Buku Fikih Faraidh bab VI; KHI Pasal 193',
  },
  {
    id: 8,
    judul: 'Gharrawain: Kasus Khusus Ibu, Ayah, dan Pasangan',
    kategori: 'Lanjutan',
    estimasi: '4 mnt baca',
    tanggal: '21 Sep 2026',
    penulis: 'Dr. Khairuddin, M.Ag',
    gambarCover: '/images/panduan/08-gharrawain.jpg',
    ringkasan:
      'Dua kasus terkenal yang membuat bagian ibu berubah: 1/3 harta atau 1/3 sisa? Inilah titik beda Umar bin Khattab dan Ibnu Abbas.',
    isi: [
      'Gharrawain atau umariyatain adalah dua kasus yang ahli warisnya sama: suami atau istri, ibu, dan ayah, tanpa anak dan tanpa saudara. Persoalannya sederhana tetapi menentukan: apakah ibu mendapat 1/3 dari seluruh harta atau 1/3 dari sisa setelah bagian pasangan diambil.',
      'Pendapat Umar bin Khattab, didukung banyak sahabat serta Imam Malik dan Imam Syafi’i, menetapkan ibu mendapat 1/3 sisa. Alasannya, bila ibu mengambil 1/3 harta sementara ayah hanya menerima sisa, bagian ibu justru melebihi ayah, padahal ayah lebih dekat dan menanggung beban nafkah.',
      'Ibnu Abbas berpendapat lain: ibu tetap mendapat 1/3 harta sebagaimana bunyi nash. Perbedaan ini bersifat ijtihad dan keduanya memiliki dasar, sehingga dalam praktik perlu dipilih pendapat yang dipakai lingkungan hukum setempat agar tidak menimbulkan sengketa baru.',
      'Contoh kasus suami, ibu, dan ayah: suami mendapat 1/2 (3/6), sisa 1/2 dibagi, ibu memperoleh 1/3 dari sisa (1/6), dan ayah menerima sisanya (2/6). Dengan AM 6, sahamnya menjadi 3, 1, dan 2. Untuk kasus istri, ibu, dan ayah, istri mendapat 1/4, ibu 1/3 sisa, dan ayah sisanya.',
    ],
    poin: [
      'Gharrawain = suami/istri + ibu + ayah, tanpa anak dan saudara',
      'Umar bin Khattab: ibu mendapat 1/3 sisa',
      'Ibnu Abbas: ibu mendapat 1/3 harta',
      'Contoh kasus suami: saham 3 (suami), 1 (ibu), 2 (ayah) dari AM 6',
    ],
    sumber: 'Buku Fikih Faraidh bab VII; QS. An-Nisa’: 11–12',
  },
  {
    id: 9,
    judul: 'Musytarakah: Saat Saudara Sekandung Ikut Bagian Seibu',
    kategori: 'Lanjutan',
    estimasi: '5 mnt baca',
    tanggal: '18 Sep 2026',
    penulis: 'Dr. Khairuddin, M.Ag',
    gambarCover: '/images/panduan/09-musytarakah.jpg',
    ringkasan:
      'Kasus di mana saudara sekandung tidak kebagian karena seluruh harta habis untuk bagian pasti, lalu disekutukan dengan saudara seibu.',
    isi: [
      'Musytarakah terjadi ketika ahli warisnya adalah suami, ibu atau nenek, dua saudara seibu atau lebih, dan saudara sekandung. Suami mengambil 1/2, ibu 1/6, dan saudara seibu bersama-sama mendapat 1/3, sehingga harta habis sebelum sampai kepada saudara sekandung sebagai ashabah.',
      'Dalam kasus ini saudara sekandung — yang secara kedudukan lebih dekat karena seayah dan seibu — justru tidak menerima apa pun. Umar bin Khattab menyelesaikan dengan menyekutukan saudara sekandung bersama saudara seibu pada bagian 1/3 tersebut.',
      'Sebagian ulama menolak penyelesaian ini dan tetap menyebut saudara sekandung gugur karena tidak ada sisa. Namun pendapat yang dipakai banyak ulama dan diterapkan dalam banyak rujukan faraid adalah penyelesaian Umar, dengan pertimbangan keadilan dan persekutuan nasab.',
      'Contoh dengan harta Rp240 juta: suami mendapat 1/2 = Rp120 juta, ibu 1/6 = Rp40 juta, dan sisa 1/3 = Rp80 juta dibagi rata kepada dua saudara seibu dan satu saudara sekandung, masing-masing sekitar Rp26,67 juta. Perhatikan bahwa bagian 1/3 dibagi rata tanpa membedakan laki-laki dan perempuan.',
    ],
    poin: [
      'Ahli waris: suami, ibu/nenek, 2+ saudara seibu, saudara sekandung',
      'Tanpa penyelesaian khusus, saudara sekandung tidak mendapat bagian',
      'Solusi Umar: saudara sekandung disekutukan pada bagian 1/3',
      'Contoh Rp240 juta: 120 (suami), 40 (ibu), 80 dibagi tiga',
    ],
    sumber: 'Buku Fikih Faraidh bab VIII; QS. An-Nisa’: 12',
  },
  {
    id: 10,
    judul: 'Munasakhat: Ahli Waris yang Wafat Sebelum Harta Dibagi',
    kategori: 'Lanjutan',
    estimasi: '5 mnt baca',
    tanggal: '15 Sep 2026',
    penulis: 'Dr. Khairuddin, M.Ag',
    gambarCover: '/images/panduan/10-munasakhat.jpg',
    ringkasan:
      'Kewarisan berganda: seseorang mewarisi dari dua arah sekaligus, atau bagian warisannya berpindah karena ia wafat sebelum pembagian.',
    isi: [
      'Munasakhat adalah keadaan ketika seorang ahli waris wafat sebelum harta warisan dibagi, sehingga bagian yang seharusnya ia terima berpindah kepada ahli warisnya sendiri. Kasus ini juga disebut kewarisan berganda karena satu orang dapat menerima dari dua jalur waris.',
      'Kewarisan berganda tidak selalu berarti munasakhat. Seseorang bisa memiliki dua sebab mewarisi sekaligus, misalnya menjadi ahli waris karena nasab dan karena pernikahan, atau menerima bagian dari dua pewaris berbeda dalam satu rangkaian peristiwa.',
      'Penyelesaian munasakhat memiliki tiga keadaan: pertama, kedudukan ahli waris tidak berubah sehingga cukup dibagikan sekali; kedua, kedudukan berubah karena ahli waris yang wafat meninggalkan penerima baru; ketiga, sebagian ahli waris menerima dari dua arah sehingga perlu dua kali perhitungan lalu digabungkan.',
      'Langkah praktisnya: selesaikan pembagian pertama, tentukan saham almarhum yang wafat belakangan, lalu bagikan saham itu kepada ahli warisnya dengan asal masalah baru. Bila ada ahli waris yang sama pada dua perhitungan, bagiannya dijumlahkan agar tidak terjadi pengulangan atau kekurangan.',
    ],
    poin: [
      'Munasakhat: ahli waris wafat sebelum harta dibagi',
      'Kewarisan berganda: dua sebab mewarisi dalam satu kasus',
      'Tiga keadaan penyelesaian: tetap, berubah, dan menerima dari dua arah',
      'Saham almarhum dibagikan ulang dengan asal masalah baru',
    ],
    sumber: 'Buku Fikih Faraidh bab IX',
  },
  {
    id: 11,
    judul: 'Kewarisan Kakek Bersama Saudara: Dua Pendapat Ulama',
    kategori: 'Lanjutan',
    estimasi: '6 mnt baca',
    tanggal: '12 Sep 2026',
    penulis: 'Dr. Khairuddin, M.Ag',
    gambarCover: '/images/panduan/11-kakek-saudara.jpg',
    ringkasan:
      'Apakah kakek menghalangi saudara, atau keduanya berbagi? Inilah salah satu ikhtilaf paling terkenal dalam faraid.',
    isi: [
      'Yang dimaksud kakek di sini adalah kakek sahih, yaitu ayah dari ayah dan ke atas, bukan kakek dari jalur ibu. Kasusnya muncul ketika pewaris meninggalkan kakek bersama saudara-saudaranya, tanpa ayah dan tanpa anak.',
      'Pendapat pertama, dipegang Abu Bakar, Ibnu Abbas, dan mazhab Hanafi, menyatakan kakek menghalangi seluruh saudara karena kedudukannya menggantikan ayah. Pendapat kedua, dipegang jumhur termasuk mazhab Maliki dan Syafi’i dalam salah satu riwayat, membolehkan saudara mewarisi bersama kakek dengan pembagian tertentu.',
      'Ketika kakek dan saudara berbagi, ulama mengenal metode muqasamah: harta dibagi dua secara konsep, kakek mengambil bagian yang lebih menguntungkan antara 1/3 harta atau berbagi sisa dengan saudara laki-laki dengan perbandingan dua banding satu. Perbandingan ini penting karena tidak boleh kakek menerima lebih kecil dari yang seharusnya.',
      'Buku ini mencatat tujuh kasus khusus kewarisan kakek bersama saudara, dengan empat bentuk penyelesaian. Karena keragamannya, kasus semacam ini sebaiknya tidak diputuskan dengan hitungan cepat, tetapi dirujuk kepada ahli faraid atau pengadilan agar tidak menimbulkan ketidakadilan.',
    ],
    poin: [
      'Kakek sahih = ayah dari ayah, bukan kakek jalur ibu',
      'Hanafi: kakek menghalangi semua saudara',
      'Jumhur: saudara tetap mewarisi bersama kakek',
      'Metode muqasamah: pilih yang lebih menguntungkan, 1/3 harta atau bagi sisa',
    ],
    sumber: 'Buku Fikih Faraidh bab X',
  },
  {
    id: 12,
    judul: 'Kewarisan Khusus: Janin, Mafqud, dan Khunsa',
    kategori: 'Lanjutan',
    estimasi: '6 mnt baca',
    tanggal: '9 Sep 2026',
    penulis: 'Dr. Khairuddin, M.Ag',
    gambarCover: '/images/panduan/12-kewarisan-khusus.jpg',
    ringkasan:
      'Tidak semua ahli waris jelas statusnya. Ada yang masih dalam kandungan, hilang, wafat bersamaan, atau berstatus khunsa.',
    isi: [
      'Bayi dalam kandungan berhak mewarisi bila lahir dalam keadaan hidup, walau hanya sebentar, karena hidupnya terbukti pada saat pembagian. Pembagian sebaiknya ditunda hingga kelahiran, atau disisakan bagian untuknya agar ahli waris lain tidak perlu mengembalikan bagian yang sudah diterima.',
      'Orang mafqud adalah orang yang hilang dan tidak diketahui hidup atau matinya. Statusnya tidak dapat dipastikan hanya dari dugaan, sehingga hartanya ditahan dan bagian warisnya disisihkan sampai ada putusan pengadilan yang menyatakan ia wafat atau terbukti masih hidup.',
      'Orang yang mati bersamaan — misalnya kecelakaan yang menimpa ayah dan anak — tidak saling mewarisi, karena masing-masing disyaratkan hidup saat kematian yang lain. Harta masing-masing dibagikan kepada ahli warisnya sendiri. Hal serupa berlaku bagi anak zina dan anak li’an yang hanya memiliki hubungan nasab dengan ibunya.',
      'Khunsa adalah orang yang memiliki ciri kelamin ganda atau tidak jelas. Penentuan statusnya dilakukan melalui ciri yang dominan saat buang air, tumbuhnya tanda kedewasaan, atau keterangan ahli. Bila tetap musykil, ulama memberikan bagian yang lebih kecil dan menunda pembagian sampai statusnya jelas, demi kehati-hatian terhadap hak semua pihak.',
    ],
    poin: [
      'Janin berhak waris bila lahir hidup; pembagian ditunda atau disisakan',
      'Mafqud: bagiannya ditahan sampai ada putusan pengadilan',
      'Mati bersamaan: tidak ada saling mewarisi',
      'Khunsa musykil: diberi bagian terkecil dan pembagian ditunda',
    ],
    sumber: 'Buku Fikih Faraidh bab XI',
  },
  {
    id: 13,
    judul: 'Harta Bersama vs Harta Warisan: Jangan Tertukar',
    kategori: 'Prosedur',
    estimasi: '5 mnt baca',
    tanggal: '6 Sep 2026',
    penulis: 'Dr. Khairuddin, M.Ag',
    gambarCover: '/images/panduan/13-harta-bersama.jpg',
    ringkasan:
      'Sebelum menghitung faraid, pisahkan dulu harta bersama. Kesalahan di langkah ini membuat seluruh angka ikut salah.',
    isi: [
      'Harta bersama (gono-gini) adalah harta yang diperoleh suami dan istri selama perkawinan. Dasar hukumnya UU No. 1 Tahun 1974 Pasal 35 dan dijabarkan dalam KHI Pasal 85–97. Harta ini berbeda dari harta bawaan masing-masing pasangan.',
      'Harta bawaan — harta yang dibawa sebelum menikah, hibah, atau warisan pribadi — tetap menjadi milik masing-masing dan tidak termasuk harta bersama. Mencampur keduanya tanpa pembukuan yang jelas adalah sumber sengketa yang paling sering muncul.',
      'Ketika salah satu pasangan wafat, harta bersama dibagi dua lebih dulu: separuh menjadi hak pasangan yang masih hidup, separuh menjadi tirkah pewaris. Peran istri yang mengurus rumah tangga tetap dihitung sebagai kontribusi, sehingga tidak ada alasan mengecilkan haknya atas harta bersama.',
      'Setelah tirkah jelas, barulah hak-hak sebelum waris ditunaikan: biaya jenazah, hutang, dan wasiat. Nilai bersih hasil pengurangan itulah yang dibagi dengan faraid. Urutan ini tidak boleh dibalik, karena membagi harta bersama sebagai warisan berarti mengambil hak pasangan yang masih hidup.',
    ],
    poin: [
      'Harta bersama diatur UU No. 1/1974 Pasal 35 dan KHI Pasal 85–97',
      'Harta bawaan tidak termasuk harta bersama',
      'Saat pasangan wafat: separuh untuk yang hidup, separuh menjadi tirkah',
      'Urutan: harta bersama, jenazah, hutang, wasiat, baru faraid',
    ],
    sumber: 'UU No. 1 Tahun 1974 Pasal 35; KHI Pasal 85–97, 171',
  },
  {
    id: 14,
    judul: 'Wasiat: Batas Sepertiga dan Rukun-Rukunnya',
    kategori: 'Prosedur',
    estimasi: '5 mnt baca',
    tanggal: '3 Sep 2026',
    penulis: 'Dr. Khairuddin, M.Ag',
    gambarCover: '/images/panduan/14-wasiat.jpg',
    ringkasan:
      'Wasiat berlaku setelah pewasiat wafat, dibatasi sepertiga harta, dan tidak sah untuk ahli waris tanpa persetujuan mereka.',
    arab: {
      teks: 'كُتِبَ عَلَيْكُمْ إِذَا حَضَرَ أَحَدَكُمُ الْمَوْتُ إِن تَرَكَ خَيْرًا الْوَصِيَّةُ لِلْوَالِدَيْنِ وَالْأَقْرَبِينَ بِالْمَعْرُوفِ',
      terjemahan:
        'Diwajibkan atas kamu, apabila seseorang di antara kamu kedatangan (tanda-tanda) kematian, jika ia meninggalkan harta yang banyak, agar berwasiat untuk ibu-bapak dan karib kerabatnya secara patut. (QS. Al-Baqarah: 180)',
    },
    isi: [
      'Wasiat adalah tasarruf atas harta yang baru berlaku setelah pewasiat wafat. Berbeda dengan hibah yang berlaku seketika, wasiat masih dapat diubah atau dicabut selama pemiliknya hidup dan berakal sehat.',
      'Dasar hukumnya antara lain QS. Al-Baqarah ayat 180 dan QS. Al-Ma’idah ayat 106, serta ayat-ayat waris yang menempatkan pelaksanaan wasiat sebelum pembagian harta. Karena itu, wasiat wajib ditunaikan lebih dulu, sepanjang tidak melampaui batas yang dibenarkan.',
      'Rukun wasiat ada empat: mushi (pemberi wasiat) yang cakap hukum, musa lah (penerima) yang jelas identitasnya, musa bih (harta atau manfaat yang diwasiatkan), dan shighat berupa ijab qabul. Bila salah satu rukun tidak lengkap, wasiat berpotensi tidak sah.',
      'Batas wasiat adalah sepertiga harta dan tidak boleh ditujukan kepada ahli waris, kecuali seluruh ahli waris menyetujuinya. Di Indonesia, KHI Pasal 209 juga mengenal wasiat wajibah yang maksimal sepertiga harta untuk anak angkat atau orang tua angkat, sebagai jalan tengah ketika hubungan nasab tidak tersedia.',
    ],
    poin: [
      'Wasiat berlaku setelah pewasiat wafat',
      'Maksimal 1/3 harta',
      'Tidak sah untuk ahli waris tanpa persetujuan semua ahli waris',
      'Rukun: mushi, musa lah, musa bih, dan shighat',
      'KHI Pasal 209: wasiat wajibah untuk anak/orang tua angkat',
    ],
    sumber: 'QS. Al-Baqarah: 180; QS. Al-Ma’idah: 106; KHI Pasal 194–209',
  },
  {
    id: 15,
    judul: 'Kewarisan dalam Kompilasi Hukum Islam Indonesia',
    kategori: 'Prosedur',
    estimasi: '7 mnt baca',
    tanggal: '31 Agu 2026',
    penulis: 'Dr. Khairuddin, M.Ag',
    gambarCover: '/images/panduan/15-suasana-tenang.jpg',
    ringkasan:
      'KHI Buku II memberi payung hukum yang berlaku di Pengadilan Agama: dari syarat ahli waris hingga ahli waris pengganti.',
    isi: [
      'Kompilasi Hukum Islam Buku II Pasal 171–193 mengatur kewarisan dengan sistem kekeluargaan bilateral, yaitu mengakui jalur kerabat dari ayah maupun ibu. Pasal 171 memuat definisi dasar seperti pewaris, ahli waris, harta warisan, dan wasiat wajibah.',
      'Syarat menjadi ahli waris menurut KHI meliputi hubungan darah atau perkawinan dengan pewaris, beragama Islam, serta tidak terhalang hukum untuk mewarisi. Pasal 173 menyebut penghalangnya: dipersalahkan membunuh atau mencoba membunuh pewaris, memfitnah agar pewaris dihukum, atau memaksa pewaris mengubah wasiat.',
      'KHI juga mengatur aul dan radd secara tegas. Pasal 192 menetapkan pembagian secara aul bila jumlah bagian melebihi harta, sedangkan Pasal 193 menyerahkan sisa kepada ahli waris dalam garis keturunan ke atas dan ke bawah. Keduanya memberi kepastian yang tidak selalu diperoleh dari kajian fikih klasik semata.',
      'Dua lembaga penting lain adalah ahli waris pengganti (Pasal 185) dan wasiat wajibah (Pasal 209). Ahli waris pengganti memungkinkan keturunan ahli waris yang wafat lebih dulu menggantikan kedudukannya, sedangkan wasiat wajibah memberi bagian terbatas kepada anak angkat atau orang tua angkat. Keduanya adalah ciri khas hukum waris Indonesia yang perlu dipahami sebelum menyimpulkan hasil hitungan faraid.',
    ],
    poin: [
      'KHI Buku II Pasal 171–193 menganut sistem bilateral',
      'Syarat ahli waris: hubungan darah/perkawinan, Islam, tidak terhalang',
      'Penghalang diatur Pasal 173',
      'Aul dan radd: Pasal 192–193',
      'Ahli waris pengganti (Pasal 185) dan wasiat wajibah (Pasal 209)',
    ],
    sumber: 'Kompilasi Hukum Islam Buku II Pasal 171–193, 209',
  },
]

export const daftarKategori = [
  'Semua',
  'Dasar',
  'Ahli Waris',
  'Perhitungan',
  'Lanjutan',
  'Prosedur',
]
