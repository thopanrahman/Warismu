# Analisis Perbandingan & Rancangan Penyelarasan Mesin Hitung Faraid (L-01)

- **Proyek:** WarisMu — Asisten Edukasi & Simulasi Waris Islam
- **Status:** **ANALISIS & RANCANGAN PENYELARASAN (ALGORITMA BELUM DIUBAH)**
- **Berkas yang Dibandingkan:**
  1. **Mesin Backend (Chat AI):** [api/lib/faraidhLokal.js](file:///D:/Kuliah/SEMESTER%205/PROJECT/warismu/api/lib/faraidhLokal.js) (1.081 baris, port langsung `alamrumambi/Faraidh-API`).
  2. **Mesin Frontend (Kalkulator Interaktif):** [src/lib/faraidhCalculator.js](file:///D:/Kuliah/SEMESTER%205/PROJECT/warismu/src/lib/faraidhCalculator.js) (724 baris, implementasi berbasis `checkAshabulFurud()` & `distribusiAshabah()`).
- **Dasar Fikih & Spesifikasi Rujukan WarisMu:**
  - Al-Qur'an: **QS. An-Nisa ayat 7, 11, 12, dan 176**.
  - Hukum Positif Indonesia: **Kompilasi Hukum Islam (KHI) Buku II Pasal 171–193**.
  - Pustaka Utama WarisMu: Buku *"Fikih Faraidh: Teknik Penyelesaian Kasus Waris"* oleh **Dr. Khairuddin, M.Ag** (Sahifah, 2020), yang menjadi sumber seluruh 15 artikel di [src/data/panduan.js](file:///D:/Kuliah/SEMESTER%205/PROJECT/warismu/src/data/panduan.js) dan ringkasan bab di [docs/references/fikih_faraid_struktur.json](file:///D:/Kuliah/SEMESTER%205/PROJECT/warismu/docs/references/fikih_faraid_struktur.json).

---

## 1. Perbandingan Arsitektur Algoritma Kedua Mesin

| Aspek | Backend (`api/lib/faraidhLokal.js`) | Frontend (`src/lib/faraidhCalculator.js`) |
|---|---|---|
| **Pendekatan Solver** | **Decision-Tree Berdasarkan Kelompok Utama (`AhliWaris.solving`)**: Memecah perhitungan menjadi 6 cabang eksklusif: `haveSon()`, `haveGrandSon()`, `haveDaughterAndGrand()`, `haveFatherAndGrand()`, `haveSiblings()`, dan `haveAnother()`. | **Rule-Based Sequential Pipeline (`new AhliWaris`)**: Menjalankan 9 fungsi pengecekan `checkAshabulFurud()` secara berurutan, lalu `checkOtherAshabah()`, menghitung KPK, mengecek Aul/Radd, dan terakhir memanggil `distribusiAshabah()`. |
| **Cakupan Input Ahli Waris** | **23 variabel** ahli waris (termasuk kerabat jauh & `pria_wanita_yang_memerdekakan_budak`). | **22 variabel** di fungsi `hitungFaraidKomprehensif()`, namun UI `KalkulatorFaraid.vue` hanya menampilkan **12 input** (tidak menampilkan input `ibu_kakek`, `saudara_tiri_seayah`, `saudari_seayah`, `saudara_saudari_tiri_seibu`, keponakan, paman, sepupu). |
| **Perhitungan Pra-Waris (Tirkah)** | Dilakukan di `api/chat.js` melalui fungsi `hitungTirkah()`: memisahkan **Harta Bersama (1/2)**, mengurangi **Hutang**, dan membatasi **Wasiat maks 1/3** (belum ada field eksplisit `biaya_jenazah`). | Dilakukan di `hitungFaraidKomprehensif()`: mengurangi **Hutang** dan **Biaya Jenazah**, lalu membatasi **Wasiat maks 1/3** (belum ada toggle **Harta Bersama**). |
| **Penanganan Sisa Tanpa Ashabah** | Tidak menerapkan rumus *Radd* proporsional; sisa harta langsung dimasukkan ke entri baru bernama `dzawil_arhaam`. | Menerapkan *Radd* proporsional (`totalBagian < this.kpk`), tetapi **hanya jika tidak ada pasangan** (`if (!adaPasangan)`). Jika ada pasangan, sisa harta mengambang di `sisaTidakTerbagi`. |

---

## 2. Identifikasi Seluruh Kasus yang Menghasilkan Perbedaan (11 Divergensi Kritis)

Berdasarkan inspeksi kode baris demi baris dan pengujian otomatis 20 skenario uji (lihat Bagian 4), ditemukan **11 perbedaan perilaku dan bug logika** di antara kedua mesin:

### D-1. Bug Kritis *Aul* Ketika Ada Ayah/Kakek + Anak Perempuan (`src/lib/faraidhCalculator.js`)
- **Lokasi Kode:** `src/lib/faraidhCalculator.js` baris 108–110 (`haveFather`) dan baris 292 (`ashabulFurud`).
- **Penyebab:** Saat ada anak perempuan (tanpa anak laki-laki), `haveFather()` menambahkan `'ayah'` ke `this.beneficiaries` (`1/6`) **dan sekaligus** mendorong `'ayah'` ke dalam array `this.ashabah`. Kemudian pada baris 292, syarat *Aul* ditulis:
  ```js
  if (totalBagian > this.kpk && !this.ashabah.length)
  ```
  Karena `this.ashabah` berisi `['ayah']` (`length === 1`), **kondisi Aul dilewati!** Akibatnya, pada kasus klasik Aul (Suami 1/4 + Ibu 1/6 + Ayah 1/6 + 2 Anak Perempuan 2/3, di mana total saham = 15/12), `faraidhCalculator.js` **tidak menaikkan penyebut ke 15**, melainkan membagi dengan penyebut 12 sehingga **total dana yang dibagikan mencapai 125% dari harta bersih** (Rp150.000.000 dari harta Rp120.000.000)!
- **Perilaku Backend (`faraidhLokal.js`):** Benar (menaikkan pembilang menjadi 15: Suami 3/15, Ibu 2/15, Ayah 2/15, 2 Anak Perempuan 8/15; total = 100% harta).

### D-2. Bug *Gharrawain / Umariyatain* (Pasangan + Ibu + Ayah, Tanpa Anak & Saudara)
- **Dasar Fikih WarisMu (`panduan.js` Artikel #8 & KHI):** Dalam kasus Suami/Istri + Ibu + Ayah, pendapat jumhur ulama (Umar bin Khattab, Imam Syafi'i) yang dipakai di Indonesia menetapkan Ibu mendapat **1/3 dari sisa** setelah dikurangi bagian pasangan (agar bagian Ibu tidak melebihi Ayah).
- **Perilaku Frontend (`faraidhCalculator.js` baris 117–126):** Tidak memiliki pengecekan Gharrawain. Ibu diberi **1/3 penuh dari seluruh harta**, sehingga pada kasus `Suami + Ibu + Ayah`, Suami mendapat 1/2 (Rp60 juta), Ibu 1/3 (Rp40 juta), dan Ayah hanya mendapat sisa 1/6 (Rp20 juta — setengah dari Ibu).
- **Perilaku Backend (`faraidhLokal.js` baris 717–723):** Menerapkan Gharrawain (Suami 1/2 = Rp60 juta, Ibu 1/3 sisa = Rp20 juta, Ayah sisa = Rp40 juta).
- **Bug Tambahan di Backend (`faraidhLokal.js` baris 720):** Di `haveFatherAndGrand()`, kode backend tidak memeriksa `if (ibu > 0)` sebelum `result.push(new PenerimaWaris('ibu', ...))` ketika `suami > 0 || istri > 0`! Akibatnya, jika pewaris meninggalkan **Suami + Ayah (tanpa Ibu)**, `faraidhLokal.js` melempar `TypeError: Cannot read properties of undefined` atau menambahkan `ibu` palsu.

### D-3. Bug *Hijab Nuqshan* Ibu oleh 2+ Saudara Ketika Ada Ayah (`api/lib/faraidhLokal.js`)
- **Dasar Fikih (QS. An-Nisa: 11 & KHI Pasal 178):** Meskipun saudara kandung/seayah/seibu terhalang (*mahjub hirman*) oleh Ayah, keberadaan **2 orang saudara atau lebih tetap menurunkan bagian Ibu dari 1/3 menjadi 1/6** (*hijab nuqshan*).
- **Perilaku Backend (`faraidhLokal.js` baris 177–182):** Fungsi `haveFatherAndGrand()` sama sekali tidak meneruskan variabel saudara (`saudara_kandung`, `saudari_kandung`, dll.) dan selalu memberi Ibu **1/3** walaupun ada 2+ saudara. Selain itu, pada baris 740 dan 781 tertulis `result[i].bagian_didapat === '1/3'` (padahal nama properti di kelas `PenerimaWaris` adalah `bagian_hukum_waris`, bukan `bagian_didapat`), sehingga `result[i].bagian_didapat` selalu `undefined`!
- **Perilaku Frontend (`faraidhCalculator.js` baris 119–125):** Benar (menghitung `totalSaudara >= 2` sehingga bagian Ibu turun menjadi `1/6`, dan Ayah mendapat sisa `5/6`).

### D-4. Bug *Radd* Tanpa Pasangan dan *Radd* Dengan Pasangan
- **Dasar Fikih WarisMu (`panduan.js` Artikel #7 & KHI Pasal 193):**
  - *Radd* adalah mengembalikan sisa harta kepada ahli waris *Ashabul Furudh Nasabiyah* secara proporsional apabila tidak ada *Ashabah*.
  - Pasangan (Suami/Istri) tidak menerima tambahan *Radd*; pasangan mengambil porsi tetapnya terlebih dahulu, kemudian **sisa harta dibagikan secara Radd kepada Ashabul Furudh Nasabiyah**.
- **Perilaku Backend (`faraidhLokal.js`):** Sama sekali tidak menerapkan Radd. Pada kasus `Ibu (1/6) + 1 Anak Perempuan (1/2)`, sisa `2/6` justru diberikan kepada entri `dzawil_arhaam` (padahal ada ahli waris utama Anak Perempuan dan Ibu!).
- **Perilaku Frontend (`faraidhCalculator.js` baris 303–317):**
  - Jika **tanpa pasangan** (`Ibu + 1 Anak Perempuan`): Benar (Radd mengubah 1/6 dan 3/6 menjadi **1/4 dan 3/4**).
  - Jika **ada pasangan** (`Suami 1/4 + 1 Anak Perempuan 1/2`, atau `Istri 1/8 + Ibu 1/6 + 1 Anak Perempuan 1/2`): Blok `if (!adaPasangan)` gagal terpenuhi, sehingga **sisa harta tidak dibagikan kepada siapa pun** (Anak Perempuan hanya mendapat 1/2, Suami 1/4, dan 1/4 harta hilang/mengambang di `sisaTidakTerbagi`).

### D-5. Bug Duplikasi Entri Ayah/Kakek Saat Mewarisi `1/6 + Ashabah` (`src/lib/faraidhCalculator.js`)
- **Dasar Fikih:** Ketika pewaris hanya meninggalkan keturunan perempuan (mis. `1 Anak Perempuan + 1 Cucu Perempuan + Ayah`), Ayah mendapat `1/6` (Ashabul Furudh) ditambah `Sisa` (Ashabah).
- **Perilaku Frontend (`faraidhCalculator.js` baris 109–110 & 398–405):** `haveFather()` memasukkan Ayah ke `this.beneficiaries` (`1/6`), dan `distribusiAshabah()` menambahkan objek `new PenerimaWaris('ayah', 'Sisa (Ashabah)', 1)` **kedua** ke dalam `this.beneficiaries`. Akibatnya, di UI Kalkulator, **Ayah muncul dua kali sebagai dua kartu ahli waris yang terpisah**!
- **Perilaku Backend (`faraidhLokal.js` baris 651–655):** Benar (menggabungkan ke dalam 1 entri `ayah` dengan bagian `1/6 + sisa 1/6` dan menjumlahkan dananya).

### D-6. Bug *Ashabah Bil Ghair* Cucu Laki-Laki + Cucu Perempuan Saat Ada 2+ Anak Perempuan (`src/lib/faraidhCalculator.js`)
- **Dasar Fikih (QS. An-Nisa: 11 & KHI):** Ketika ada 2 Anak Perempuan (yang mengambil 2/3), Cucu Perempuan terhalang dari bagian pasti 1/6, **tetapi jika ada Cucu Laki-Laki**, Cucu Laki-Laki menarik Cucu Perempuan menjadi *Ashabah Bil Ghair* (*"Al-akh al-mubarak"* / saudara yang diberkahi) untuk membagi sisa 1/3 dengan rasio 2:1.
- **Perilaku Frontend (`faraidhCalculator.js` baris 144–145):** Menulis syarat `if (!aL && aP <= 1) this.ashabah.push('cucu_perempuan', 'cucu_laki_laki')`. Karena syaratnya `aP <= 1`, ketika ada **2 Anak Perempuan (`aP = 2`)**, baik Cucu Perempuan **maupun Cucu Laki-Laki tidak dimasukkan ke Ashabah**! Akibatnya Cucu Laki-Laki kehilangan haknya dan seluruh harta di-Radd ke 2 Anak Perempuan.
- **Perilaku Backend (`faraidhLokal.js` baris 330–444 `haveGrandSon`):** Benar (2 Anak Perempuan mendapat 2/3, dan sisa 1/3 dibagi 2:1 antara Cucu Laki-Laki dan Cucu Perempuan).

### D-7. Bug Kehilangan Handler *Ashabah Bil Ghair* untuk Saudara Seayah + Saudari Seayah (`src/lib/faraidhCalculator.js`)
- **Lokasi Kode:** `src/lib/faraidhCalculator.js` baris 214 (`haveConsanguineSister`) vs baris 334–406 (`distribusiAshabah`).
- **Penyebab:** Pada `haveConsanguineSister()`, ketika ada `saudara_tiri_seayah` dan `saudari_seayah`, keduanya didorong ke `this.ashabah.push('saudari_seayah', 'saudara_tiri_seayah')` (dengan `'saudari_seayah'` di indeks pertama!). Namun di `distribusiAshabah()`, pengembang hanya menulis blok `if` 2:1 untuk:
  1. `anak_laki_laki` & `anak_perempuan`
  2. `cucu_laki_laki` & `cucu_perempuan`
  3. `saudara_kandung` & `saudari_kandung`
  **Blok untuk `saudara_tiri_seayah` & `saudari_seayah` lupa ditulis!** Akibatnya, eksekusi jatuh ke loop *Tunggal Ashabah* (baris 398), mengambil elemen pertama `this.ashabah[0]` yaitu `'saudari_seayah'`, memberikan **100% sisa kepada Saudari Seayah**, dan **Saudara Laki-Laki Seayah mendapat Rp0**!
- **Perilaku Backend (`faraidhLokal.js`):** Benar (membagi sisa 2:1 antara Saudara Laki-Laki Seayah dan Saudari Perempuan Seayah).

### D-8. Bug Pelengkap 2/3 (`1/6`) untuk Saudari Seayah Bersama 1 Saudari Kandung di `haveAnother` (`api/lib/faraidhLokal.js`)
- **Dasar Fikih:** Jika tidak ada anak/ayah/saudara laki-laki, dan terdapat **1 Saudari Kandung** bersama **1+ Saudari Seayah**, maka Saudari Kandung mendapat `1/2` dan Saudari Seayah mendapat **`1/6` sebagai pelengkap 2/3** (*Takmilatan li ats-Tsulutsain*).
- **Perilaku Backend (`faraidhLokal.js` baris 976–982 `haveAnother`):** Menulis `if (saudari_kandung > 0) { ... } else if (saudari_seayah > 0) { ... }`. Karena menggunakan `else if`, ketika ada 1 Saudari Kandung, **Saudari Seayah langsung diabaikan sepenuhnya** dan tidak diberi 1/6!
- **Perilaku Frontend (`faraidhCalculator.js` baris 221–223):** Benar (memberikan `1/6` kepada `saudari_seayah` ketika `saudari_kandung === 1`).

### D-9. Bug *Hijab* Nenek dari Pihak Ayah (`ibu_kakek`) oleh Ayah & Pembagian Dua Nenek
- **Dasar Fikih:**
  1. Ayah kandung menghalangi (*mahjub hirman*) Nenek dari pihak Ayah (`ibu_kakek`), tetapi **tidak** menghalangi Nenek dari pihak Ibu (`nenek`).
  2. Jika Ibu wafat dan Ayah wafat, sedangkan Nenek pihak Ibu (`nenek`) dan Nenek pihak Ayah (`ibu_kakek`) sama-sama hidup, keduanya **berbagi bagian 1/6 secara rata (masing-masing 1/12)**.
- **Perilaku Backend (`faraidhLokal.js`):** Selalu menulis `if (ibu > 0) ... else if (nenek > 0) ... else if (ibu_kakek > 0)`. Akibatnya:
  1. Jika kedua nenek sama-sama hidup, `ibu_kakek` diabaikan karena `else if (nenek > 0)` sudah terpenuhi.
  2. Jika `ayah > 0` dan hanya ada `ibu_kakek > 0` (tanpa Ibu dan tanpa Nenek pihak Ibu), `faraidhLokal.js` tetap memberi `ibu_kakek` 1/6 padahal seharusnya terhalang oleh Ayah!
- **Perilaku Frontend (`faraidhCalculator.js` baris 171–182):**
  1. Saat hanya ada `ibu_kakek`, sudah mengecek `!this.data.ayah`.
  2. Namun saat `nenek` **dan** `ibu_kakek` keduanya ada (baris 173), frontend lupa mengecek `!this.data.ayah` untuk `ibu_kakek`, sehingga `ibu_kakek` tetap mendapat 1/12 meskipun Ayah masih hidup.

### D-10. Bug *Ashabah Ma'al Ghair* Saudari Kandung Tidak Menghalangi Saudara Seayah/Keponakan/Paman (`src/lib/faraidhCalculator.js`)
- **Dasar Fikih:** Ketika Saudari Kandung bersama Anak/Cucu Perempuan, Saudari Kandung menjadi *Ashabah Ma'al Ghair* (kedudukannya setara dengan Saudara Laki-Laki Kandung), sehingga ia **menghalangi** Saudara Laki-Laki Seayah, Saudari Seayah, Keponakan, Paman, dan Sepupu.
- **Perilaku Frontend (`faraidhCalculator.js` baris 209 & 227–229):** Di `haveConsanguineSister()`, `noBlocker` hanya memeriksa `!this.data.saudara_kandung` (tidak memeriksa apakah `saudari_kandung` sudah menjadi *Ashabah Ma'al Ghair* bersama Anak/Cucu Perempuan).

### D-11. Kesenjangan Input Form UI `KalkulatorFaraid.vue`
- Meskipun `src/lib/faraidhCalculator.js` mendukung 22 jenis ahli waris, komponen [src/components/KalkulatorFaraid.vue](file:///D:/Kuliah/SEMESTER%205/PROJECT/warismu/src/components/KalkulatorFaraid.vue#L441-L518) pada bagian *"3. Ahli Waris Sekunder"* baru menyediakan tombol input untuk 6 kerabat sekunder (`cucu_laki_laki`, `cucu_perempuan`, `kakek`, `nenek`, `saudara_kandung`, `saudari_kandung`) dan belum menampilkan kontrol untuk `ibu_kakek` (Nenek pihak Ayah), `saudara_tiri_seayah`, `saudari_seayah`, serta `saudara_saudari_tiri_seibu` (padahal keempatnya sudah dideklarasikan di `reactive(ahliWaris)` baris 29–34).

---

## 3. Tabel Kasus Uji Komparatif (Total Harta Bersih / Tirkah = Rp120.000.000)

Berikut adalah hasil eksekusi aktual dari kedua mesin dibandingkan dengan hasil yang diharapkan berdasarkan Fikih Faraid (Buku Dr. Khairuddin, M.Ag) & KHI Buku II:

| ID | Skenario Ahli Waris | Hasil Aktual Backend (`faraidhLokal.js`) | Hasil Aktual Frontend (`faraidhCalculator.js`) | Hasil yang Diharapkan (KHI & Fikih Faraidh) | Status & Analisis |
|---|---|---|---|---|---|
| **TC-01** | **Keluarga Inti:** Istri (1), Ibu (1), Anak Laki (2), Anak Pr (1) | Istri: 3/24 (Rp15 jt)<br>Ibu: 4/24 (Rp20 jt)<br>2 Anak Lk: 4/5 sisa (Rp68 jt)<br>1 Anak Pr: 1/5 sisa (Rp17 jt) | Istri: 3/24 (Rp15 jt)<br>Ibu: 4/24 (Rp20 jt)<br>2 Anak Lk: 4/5 sisa (Rp68 jt)<br>1 Anak Pr: 1/5 sisa (Rp17 jt) | Istri: 1/8 (Rp15 jt)<br>Ibu: 1/6 (Rp20 jt)<br>2 Anak Lk: Rp68 jt (@Rp34 jt)<br>1 Anak Pr: Rp17 jt | **SAMA & VALID** |
| **TC-02** | **Gharrawain 1:** Suami (1), Ibu (1), Ayah (1) | Suami: 1/2 (Rp60 jt)<br>Ibu: 1/3 sisa (Rp20 jt)<br>Ayah: Sisa (Rp40 jt) | Suami: 3/6 (Rp60 jt)<br>Ibu: 2/6 (**Rp40 jt**)<br>Ayah: Sisa 1/6 (**Rp20 jt**) | Suami: 1/2 (Rp60 jt)<br>Ibu: 1/3 sisa = 1/6 (Rp20 jt)<br>Ayah: Sisa = 2/6 (Rp40 jt)<br>*(Panduan Artikel #8)* | **BERBEDA** — Frontend belum menerapkan Gharrawain (D-2). |
| **TC-03** | **Gharrawain 2:** Istri (1), Ibu (1), Ayah (1) | Istri: 1/4 (Rp30 jt)<br>Ibu: 1/3 sisa (Rp30 jt)<br>Ayah: Sisa (Rp60 jt) | Istri: 3/12 (Rp30 jt)<br>Ibu: 4/12 (**Rp40 jt**)<br>Ayah: Sisa 5/12 (**Rp50 jt**) | Istri: 1/4 (Rp30 jt)<br>Ibu: 1/3 sisa = 1/4 (Rp30 jt)<br>Ayah: Sisa = 2/4 (Rp60 jt)<br>*(Panduan Artikel #8)* | **BERBEDA** — Frontend belum menerapkan Gharrawain (D-2). |
| **TC-04** | **Hijab Nuqshan Ibu:** Ibu (1), Ayah (1), Saudara Kandung (2) | Ibu: **1/3 (Rp40 jt)**<br>Ayah: Sisa (**Rp80 jt**) | Ibu: 1/6 (Rp20 jt)<br>Ayah: Sisa 5/6 (Rp100 jt) | Ibu: 1/6 (Rp20 jt)<br>Ayah: Sisa 5/6 (Rp100 jt)<br>2 Sdr Kandung: Mahjub oleh Ayah | **BERBEDA** — Backend lupa menurunkan Ibu ke 1/6 saat ada 2+ saudara & Ayah (D-3). |
| **TC-05** | **Aul Klasik (AM 12 → 15):** Suami (1), Ibu (1), Ayah (1), Anak Pr (2) | Suami: 3/15 (Rp24 jt)<br>Ibu: 2/15 (Rp16 jt)<br>Ayah: 2/15 (Rp16 jt)<br>2 Anak Pr: 8/15 (Rp64 jt) | Suami: 3/12 (**Rp30 jt**)<br>Ibu: 2/12 (**Rp20 jt**)<br>Ayah: 2/12 (**Rp20 jt**)<br>2 Anak Pr: 8/12 (**Rp80 jt**)<br>*(Total = Rp150 jt / 125%!)* | Suami: 3/15 (Rp24 jt)<br>Ibu: 2/15 (Rp16 jt)<br>Ayah: 2/15 (Rp16 jt)<br>2 Anak Pr: 8/15 (Rp64 jt)<br>*(Panduan Artikel #6 & KHI Ps. 192)* | **BERBEDA (KRITIS)** — Frontend gagal mendeteksi Aul karena `ayah` masuk ke `ashabah` (D-1). |
| **TC-06** | **Radd Tanpa Pasangan:** Ibu (1), Anak Pr (1) | Anak Pr: 3/6 (Rp60 jt)<br>Ibu: 1/6 (Rp20 jt)<br>`dzawil_arhaam`: **2/6 (Rp40 jt)** | Ibu: 1/4 setelah Radd (Rp30 jt)<br>Anak Pr: 3/4 setelah Radd (Rp90 jt) | Ibu: 1/4 (Rp30 jt)<br>Anak Pr: 3/4 (Rp90 jt)<br>*(Panduan Artikel #7 & KHI Ps. 193)* | **BERBEDA** — Backend tidak menerapkan Radd dan membuang sisa ke `dzawil_arhaam` (D-4). |
| **TC-07** | **Radd Dengan Pasangan 1:** Suami (1), Anak Pr (1) | Suami: 1/4 (Rp30 jt)<br>Anak Pr: 2/4 (Rp60 jt)<br>`dzawil_arhaam`: **1/4 (Rp30 jt)** | Suami: 1/4 (Rp30 jt)<br>Anak Pr: 2/4 (**Rp60 jt**)<br>*(Sisa Rp30 jt tidak terbagi!)* | Suami: 1/4 tetap (Rp30 jt)<br>Anak Pr: 1/2 + Radd 1/4 = **3/4 (Rp90 jt)**<br>*(KHI Ps. 193 & Jumhur)* | **KEDUANYA KELIRU** — Pasangan ambil 1/4, sisa 3/4 seharusnya di-Radd ke Anak Perempuan (D-4). |
| **TC-08** | **Radd Dengan Pasangan 2:** Istri (1), Ibu (1), Anak Pr (1) | Istri: 3/24 (Rp15 jt)<br>Ibu: 4/24 (Rp20 jt)<br>Anak Pr: 12/24 (Rp60 jt)<br>`dzawil_arhaam`: **5/24 (Rp25 jt)** | Istri: 3/24 (Rp15 jt)<br>Ibu: 4/24 (**Rp20 jt**)<br>Anak Pr: 12/24 (**Rp60 jt**)<br>*(Sisa Rp25 jt tidak terbagi!)* | Istri: 1/8 tetap (Rp15 jt)<br>Sisa 7/8 (Rp105 jt) dibagi Radd 1:3 antara Ibu & Anak Pr:<br>Ibu: **7/32 (Rp26,25 jt)**<br>Anak Pr: **21/32 (Rp78,75 jt)** | **KEDUANYA KELIRU** — Sisa setelah bagian pasangan wajib di-Radd ke Ibu & Anak Pr sesuai rasio 1:3 (D-4). |
| **TC-09** | **Ayah 1/6 + Ashabah:** Anak Pr (1), Cucu Pr (1), Ayah (1) | Anak Pr: 3/6 (Rp60 jt)<br>Cucu Pr: 1/6 (Rp20 jt)<br>Ayah: 1/6 + sisa 1/6 (Rp40 jt) | Anak Pr: 3/6 (Rp60 jt)<br>Cucu Pr: 1/6 (Rp20 jt)<br>**Ayah #1:** 1/6 (Rp20 jt)<br>**Ayah #2:** Sisa 1/6 (Rp20 jt) | Anak Pr: 1/2 (Rp60 jt)<br>Cucu Pr: 1/6 pelengkap 2/3 (Rp20 jt)<br>Ayah: 1/6 + Sisa 1/6 = 2/6 (Rp40 jt, **1 baris**) | **BERBEDA STRUKTUR** — Frontend menduplikasi entri Ayah menjadi 2 kartu terpisah (D-5). |
| **TC-10** | **Cucu Ashabah Bil Ghair:** Anak Pr (2), Cucu Pr (1), Cucu Lk (1) | 2 Anak Pr: 2/3 (Rp80 jt)<br>1 Cucu Lk: 2/3 sisa (Rp26,67 jt)<br>1 Cucu Pr: 1/3 sisa (Rp13,33 jt) | 2 Anak Pr: **2/2 setelah Radd (Rp120 jt)**<br>*(Cucu Lk & Cucu Pr dapat Rp0!)* | 2 Anak Pr: 2/3 (Rp80 jt)<br>1 Cucu Lk: 2/9 (Rp26,67 jt)<br>1 Cucu Pr: 1/9 (Rp13,33 jt) | **BERBEDA (KRITIS)** — Frontend menggugurkan Cucu Laki-laki karena syarat `aP <= 1` (D-6). |
| **TC-11** | **Ashabah Ma'al Ghair 1:** Anak Pr (1), Saudari Kandung (1) | Anak Pr: 1/2 (Rp60 jt)<br>Saudari Kandung: Sisa 1/2 (Rp60 jt) | Anak Pr: 1/2 (Rp60 jt)<br>Saudari Kandung: Sisa 1/2 (Rp60 jt) | Anak Pr: 1/2 (Rp60 jt)<br>Saudari Kandung: Ashabah Ma'al Ghair 1/2 (Rp60 jt) | **SAMA & VALID** |
| **TC-13** | **Pelengkap 2/3 Saudari Seayah (Aul 13):** Istri (1), Ibu (1), Saudari Kandung (1), Saudari Seayah (1) | Istri: 3/12 (Rp30 jt)<br>Ibu: 2/12 (Rp20 jt)<br>Saudari Kandung: 6/12 (Rp60 jt)<br>`dzawil_arhaam`: **1/12 (Rp10 jt)**<br>*(Saudari Seayah dapat Rp0!)* | Istri: 3/13 (Rp27,69 jt)<br>Ibu: 2/13 (Rp18,46 jt)<br>Saudari Kandung: 6/13 (Rp55,38 jt)<br>Saudari Seayah: 2/13 (Rp18,46 jt) | AM 12 → Aul 13:<br>Istri: 3/13 (Rp27,69 jt)<br>Ibu: 2/13 (Rp18,46 jt)<br>Saudari Kandung: 6/13 (Rp55,38 jt)<br>Saudari Seayah: 2/13 (Rp18,46 jt) | **BERBEDA** — Backend mengabaikan Saudari Seayah (1/6 pelengkap 2/3) saat ada 1 Saudari Kandung (D-8). |
| **TC-14** | **Ashabah Bil Ghair Saudara Seayah:** Suami (1), Saudara Seibu (1), Saudara Lk Seayah (1), Saudari Pr Seayah (1) | Suami: 3/6 (Rp60 jt)<br>Sdr Seibu: 1/6 (Rp20 jt)<br>Sdr Lk Seayah: 2/3 sisa (Rp26,67 jt)<br>Sdri Pr Seayah: 1/3 sisa (Rp13,33 jt) | Suami: 3/6 (Rp60 jt)<br>Sdr Seibu: 1/6 (Rp20 jt)<br>Sdri Pr Seayah: **Sisa 2/6 (Rp40 jt)**<br>*(Sdr Lk Seayah dapat Rp0!)* | Suami: 1/2 (Rp60 jt)<br>Sdr Seibu: 1/6 (Rp20 jt)<br>Sdr Lk Seayah: 2/9 (Rp26,67 jt)<br>Sdri Pr Seayah: 1/9 (Rp13,33 jt) | **BERBEDA (KRITIS)** — Frontend lupa menangani pembagian 2:1 `saudara_tiri_seayah` & `saudari_seayah` (D-7). |
| **TC-16** | **Hijab Nenek Pihak Ayah oleh Ayah:** Nenek Ibu (1), Nenek Ayah/`ibu_kakek` (1), Ayah (1) | Nenek Ibu: 1/6 (Rp20 jt)<br>Ayah: Sisa 5/6 (Rp100 jt) | Nenek Ibu: **1/12 (Rp10 jt)**<br>Nenek Ayah: **1/12 (Rp10 jt)**<br>Ayah: Sisa 10/12 (Rp100 jt) | Nenek Ibu: 1/6 (Rp20 jt)<br>Nenek Ayah: Mahjub oleh Ayah (Rp0)<br>Ayah: Sisa 5/6 (Rp100 jt) | **BERBEDA** — Frontend memberikan 1/12 kepada Nenek pihak Ayah padahal ada Ayah kandung (D-9). |
| **TC-17** | **Dua Nenek Tanpa Ibu & Tanpa Ayah:** Nenek Ibu (1), Nenek Ayah (1), Anak Lk (1) | Nenek Ibu: **1/6 (Rp20 jt)**<br>Nenek Ayah: **Rp0**<br>Anak Lk: 5/6 (Rp100 jt) | Nenek Ibu: 1/12 (Rp10 jt)<br>Nenek Ayah: 1/12 (Rp10 jt)<br>Anak Lk: Sisa 10/12 (Rp100 jt) | Nenek Ibu & Nenek Ayah berbagi 1/6 rata (masing-masing 1/12 = Rp10 jt)<br>Anak Lk: Sisa 5/6 (Rp100 jt) | **BERBEDA** — Backend mengabaikan Nenek pihak Ayah karena `else if (nenek > 0)` (D-9). |

---

## 4. Rancangan Penyelarasan (Unified Faraid Engine Design)

Agar hasil perhitungan di **Kalkulator Frontend (`/kalkulator`)** dan **Konsultasi Chat AI Backend (`/api/chat`)** **100% konsisten, deterministik, dan bebas dari 11 bug di atas**, direkomendasikan rancangan penyelarasan berikut:

### 4.1. Prinsip Arsitektur: *Single Deterministic Solver Engine*
Daripada memelihara dua algoritma perhitungan berbeda di `api/lib/faraidhLokal.js` dan `src/lib/faraidhCalculator.js`, kedua modul harus memakai **logika solver deterministik yang sama**, sementara masing-masing modul tetap mempertahankan kontrak fungsi dan metadata UI-nya:
- **Kontrak Backend (`api/lib/faraidhLokal.js`):** Tetap mengekspor `hitungFaraidLokal(ahliWaris, totalHarta)` yang mengembalikan array `PenerimaWaris` (`[{ nama, bagian_hukum_waris, jumlah_orang, bagian_terhitung, dana_didapat, dana_per_orang }]`) sehingga `api/lib/faraidh.js` dan `api/chat.js` **tidak perlu diubah kontraknya**.
- **Kontrak Frontend (`src/lib/faraidhCalculator.js`):** Tetap mengekspor `hitungFaraidKomprehensif(...)`, `formatRupiah()`, `bersihkanAngka()`, `INFO_AHLI_WARIS`, dan `CONTOH_SKENARIO` sehingga komponen `KalkulatorFaraid.vue`, `HasilPerhitungan.vue`, dan `HeroSection.vue` **tidak rusak**.

### 4.2. Spesifikasi Perbaikan Algoritma Solver (7 Aturan Inti)

1. **Perbaikan Urutan & Syarat Ashabul Furudh (`checkAshabulFurud`):**
   - **Pasangan (`suami` / `istri`):** Suami `1/2` (tanpa keturunan) atau `1/4` (ada keturunan). Istri `1/4` (tanpa keturunan) atau `1/8` (ada keturunan).
   - **Ayah (`ayah`):**
     - Jika ada keturunan laki-laki (`anak_laki_laki` atau `cucu_laki_laki`): `1/6` (Ashabul Furudh murni).
     - Jika hanya ada keturunan perempuan (`anak_perempuan` atau `cucu_perempuan` tanpa keturunan laki-laki): `1/6` (Ashabul Furudh) **dan ditandai sebagai penerima sisa potensial (`ashabah_maa_furudh`)** yang hanya aktif apabila setelah pembagian Ashabul Furudh masih terdapat sisa (`totalBagian < kpk`). Dengan cara ini, **kasus Aul (TC-05) tidak akan terblokir!**
     - Jika tidak ada keturunan sama sekali: Ashabah binafsihi.
   - **Kakek (`kakek`, jika `!ayah`):** Sama dengan kaidah Ayah (dan menghalangi saudara sesuai mazhab Hanafi/Abu Bakar yang saat ini dipakai konsisten oleh kedua mesin di TC-15).
   - **Ibu (`ibu`):**
     - Cek apakah merupakan kasus **Gharrawain** (`(suami || istri) && ibu && ayah && !adaKeturunan && totalSaudara === 0`): Jika ya, Ibu mendapat **`1/3 dari sisa`** setelah dikurangi bagian pasangan (Suami `1/2` → Ibu `1/6`, Ayah `2/6`; Istri `1/4` → Ibu `1/4`, Ayah `2/4`).
     - Jika bukan Gharrawain: `1/6` bila `adaKeturunan || totalSaudara >= 2`; atau `1/3` bila tidak ada keturunan dan saudara < 2.
   - **Nenek (`nenek` & `ibu_kakek`, jika `!ibu`):**
     - `nenek` (pihak Ibu) berhak jika `!ibu`.
     - `ibu_kakek` (pihak Ayah) berhak jika `!ibu && !ayah`.
     - Jika keduanya sama-sama berhak (`nenek && ibu_kakek && !ayah`), masing-masing mendapat `1/12` (berbagi `1/6`). Jika hanya salah satu yang berhak, mendapat `1/6`.
   - **Anak & Cucu (`anak_laki_laki`, `anak_perempuan`, `cucu_laki_laki`, `cucu_perempuan`):**
     - Jika ada `anak_laki_laki`: `anak_laki_laki` (dan `anak_perempuan` bila ada, rasio 2:1) menjadi Ashabah; semua cucu terhalang (*mahjub*).
     - Jika tidak ada `anak_laki_laki`:
       - `anak_perempuan === 1` → `1/2`; `anak_perempuan >= 2` → `2/3`.
       - Jika ada `cucu_laki_laki`: `cucu_laki_laki` (dan `cucu_perempuan` bila ada, rasio 2:1) menjadi Ashabah (**tanpa dibatasi `aP <= 1`**, memperbaiki **TC-10**).
       - Jika tidak ada `cucu_laki_laki` dan ada `cucu_perempuan`: bila `anak_perempuan === 0` maka `1/2` (1 orang) atau `2/3` (2+ orang); bila `anak_perempuan === 1` maka `1/6` (pelengkap 2/3); bila `anak_perempuan >= 2` maka terhalang.
   - **Saudara/i Kandung & Seayah:**
     - Hanya mewarisi jika `!anak_laki_laki && !cucu_laki_laki && !ayah && !kakek`.
     - Jika ada `saudara_kandung`: menjadi Ashabah (bersama `saudari_kandung` rasio 2:1 bila ada), menghalangi saudara/i seayah.
     - Jika tidak ada `saudara_kandung` dan ada `saudari_kandung`:
       - Jika ada `anak_perempuan` atau `cucu_perempuan`: `saudari_kandung` menjadi **Ashabah Ma'al Ghair** (dan menghalangi saudara/i seayah!).
       - Jika tidak ada keturunan perempuan: `1/2` (1 orang) atau `2/3` (2+ orang).
     - Jika tidak ada `saudara_kandung` dan `saudari_kandung` belum menjadi Ashabah Ma'al Ghair:
       - Jika ada `saudara_tiri_seayah` (dan `saudari_kandung <= 1` atau ada `saudara_tiri_seayah` saat `saudari_kandung >= 2`): `saudara_tiri_seayah` (bersama `saudari_seayah` rasio 2:1 bila ada) menjadi Ashabah (**memperbaiki TC-14**).
       - Jika tidak ada `saudara_tiri_seayah` dan ada `saudari_seayah`:
         - Jika ada keturunan perempuan (dan `!saudari_kandung`): `saudari_seayah` menjadi **Ashabah Ma'al Ghair**.
         - Jika tidak ada keturunan perempuan: bila `saudari_kandung === 0` mendapat `1/2` (1 orang) atau `2/3` (2+ orang); bila `saudari_kandung === 1` mendapat **`1/6` pelengkap 2/3** (**memperbaiki TC-13**).

2. **Perbaikan Penggabungan `1/6 + Sisa` untuk Ayah / Kakek (Memperbaiki TC-09):**
   - Ketika Ayah atau Kakek menerima `1/6` sebagai Ashabul Furudh sekaligus menjadi penerima sisa Ashabah, sisa dana dan label bagian (`1/6 + Sisa ...`) digabungkan ke dalam **satu objek `PenerimaWaris` yang sudah ada** (tidak membuat entri kedua).

3. **Perbaikan Mekanisme *Aul* (Memperbaiki TC-05):**
   - Jika `totalBagian > kpk`, maka penaikan penyebut menjadi `aulKpk = totalBagian` selalu dijalankan (karena ketika `totalBagian > kpk`, sisa harta = 0 sehingga Ashabah tidak mungkin menerima sisa).

4. **Perbaikan Mekanisme *Radd* Tanpa dan Dengan Pasangan (Memperbaiki TC-06, TC-07, TC-08, TC-20):**
   - Sesuai **KHI Pasal 193** dan buku Dr. Khairuddin Bab VI:
     - Jika `totalBagian < kpk` dan **tidak ada penerima Ashabah**:
       - **Kasus A (Tanpa Pasangan):** Seluruh penerima Ashabul Furudh Nasabiyah mendapat Radd proporsional (`count / totalBagian * dana`).
       - **Kasus B (Ada Pasangan + Ada Ashabul Furudh Nasabiyah):** Pasangan (Suami/Istri) mengambil bagian tetapnya (`bagianPasangan = countPasangan / kpk`), lalu **sisa harta (`dana - danaPasangan`) dibagikan secara Radd proporsional kepada para Ashabul Furudh Nasabiyah** sesuai rasio saham mereka.
       - **Kasus C (Hanya Pasangan Tunggal tanpa ahli waris nasab maupun dzawil arham):** Pasangan mendapat bagian furudh-nya (1/2 atau 1/4), dan sisa dicatat pada keterangan/Baitul Mal (atau `dzawil_arhaam` sesuai kontrak API).

---

## 5. Rencana Implementasi Penyelarasan (Menunggu Persetujuan Anda)

Sesuai instruksi Bagian D, **kami berhenti di tahap analisis dan rancangan ini tanpa mengubah `api/lib/faraidhLokal.js` maupun `src/lib/faraidhCalculator.js`**.

Apabila Anda menyetujui rancangan penyelarasan di atas, langkah implementasi berikutnya adalah:
1. Menempatkan fungsi solver yang telah diperbaiki ke dalam `api/lib/faraidhLokal.js` dan `src/lib/faraidhCalculator.js`.
2. (Opsional) Menampilkan 4 kontrol ahli waris sekunder yang sudah ada di state `KalkulatorFaraid.vue` (`ibu_kakek`, `saudara_tiri_seayah`, `saudari_seayah`, `saudara_saudari_tiri_seibu`) agar seluruh 16 ahli waris di UI Kalkulator dapat diuji pada pengujian Black Box.
3. Menjalankan kembali seluruh 20 kasus uji (`TC-01` s/d `TC-20`) untuk membuktikan bahwa output Backend dan Frontend **100% identik dan sesuai KHI/Fikih Faraidh**.
