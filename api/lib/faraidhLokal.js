// ============================================================================
// KREDIT / ATRIBUSI — WAJIB DIPERTAHANKAN
// ----------------------------------------------------------------------------
// Algoritma pembagian waris di berkas ini BUKAN karya WarisMu. Seluruh logika
// perhitungan diambil dari proyek open source:
//
//   Faraidh-API oleh alamrumambi
//   https://github.com/alamrumambi/Faraidh-API
//   (branch master, commit terakhir 2021-04-13)
//
// Berkas sumber yang diadaptasi:
//   - Models/solvingModel.js      -> kelas AhliWaris (logika pembagian)
//   - Models/beneficiaryModel.js  -> kelas PenerimaWaris
//   - helpers/dataIndex.js        -> dataIndex()
//   - helpers/kpk.js              -> kpk()
//
// Repo aslinya tidak menyertakan berkas lisensi. Atribusi ini ditulis sebagai
// bentuk penghargaan dan kejujuran akademik. Bila WarisMu dipublikasikan atau
// dinilai secara formal, konfirmasikan lebih dulu ke pemilik repo atau
// cantumkan sumbernya secara eksplisit di laporan.
// ============================================================================
//
// Mesin hitung lokal: dipakai sebagai pengganti instance Faraidh-API daring,
// karena endpoint publik bawaan repo (Heroku) sudah mati.
//
// Perubahan dari sumber asli (tidak mengubah hasil pembagian):
//   1. Diubah ke ESM dan console.log dibuang.
//   2. haveDaughterAndGrand(): pencatat KPK untuk cucu perempuan memakai
//      penyebut cucu perempuan (cP). Sumber asli memakai aP sehingga melempar
//      TypeError saat kasus hanya punya cucu perempuan tanpa anak perempuan.
//   3. Penerima tanpa jumlah orang (dzawil arhaam) memakai 1 agar
//      dana_per_orang tidak NaN.
//
// Kontrak masuk: { ahli_waris: { ...23 field... }, total_harta: number }
// Kontrak keluar: array penerima_waris seperti Faraidh-API.

class PenerimaWaris {
  constructor(nama, bagianHukumWaris, jumlahOrang) {
    this.nama = nama
    this.bagian_hukum_waris = bagianHukumWaris
    this.jumlah_orang = jumlahOrang
    this.bagian_terhitung = ''
    this.dana_didapat = 0
    this.dana_per_orang = jumlahOrang ? this.dana_didapat / jumlahOrang : 0
  }

  updateFunds(nilai) {
    this.dana_didapat = Number(nilai.toFixed(2))
    this.dana_per_orang = Number((nilai / this.jumlah_orang).toFixed(2))
  }

  updateCountPart(nilai) {
    this.bagian_terhitung = nilai
  }
}

// Cari indeks elemen pertama yang nilai `param`-nya termasuk `daftarNilai`.
function dataIndex(daftarNilai, param, arr) {
  let hasil = -1
  for (let i in arr) {
    for (let j in daftarNilai) {
      if (arr[i][param] === daftarNilai[j]) {
        hasil = +i
        break
      }
    }
    if (hasil !== -1) break
  }
  return hasil
}

// Kelipatan persekutuan terkecil, dihitung dengan cara yang sama seperti sumber
// asli: naikkan `hitung` sampai habis dibagi semua penyebut DAN habis membagi
// perkalian penyebut (pembilangSementara).
function kpk(daftarPenyebut, pembilangSementara) {
  daftarPenyebut.sort((a, b) => b - a)
  let hitung = daftarPenyebut[0]
  let selesai = false
  while (selesai === false) {
    selesai = true
    if (pembilangSementara % hitung === 0) {
      for (const i in daftarPenyebut) {
        if (hitung % daftarPenyebut[i] !== 0) {
          selesai = false
          hitung++
          break
        }
      }
    } else {
      selesai = false
      hitung++
    }
  }
  return hitung
}

// Jumlah orang untuk penerima yang tidak punya field jumlah (dzawil arham).
function jumlahAtauSatu(nilai) {
  const n = Number(nilai)
  return Number.isFinite(n) && n > 0 ? n : 1
}

class AhliWaris {
  // =============================== PEMBAGIAN UTAMA ===============================
  static solving(body) {
    const {
      anak_laki_laki,
      cucu_laki_laki,
      anak_perempuan,
      cucu_perempuan,
      ayah,
      kakek,
      saudara_saudari_tiri_seibu,
      saudara_kandung,
      saudara_tiri_seayah,
      anak_laki_laki_saudara_kandung,
      anak_laki_laki_saudara_tiri_seayah,
      saudara_kandung_ayah,
      saudara_tiri_seayah_ayah,
      anak_laki_laki_saudara_kandung_ayah,
      anak_laki_laki_saudara_tiri_seayah_ayah,
      saudari_kandung,
      saudari_seayah,
      ibu,
      nenek,
      ibu_kakek,
      suami,
      istri,
      pria_wanita_yang_memerdekakan_budak,
    } = body.ahli_waris

    // Ada anak laki-laki
    if (anak_laki_laki > 0) {
      return this.haveSon(
        { anak_laki_laki, anak_perempuan, ayah, kakek, suami, istri, ibu, nenek, ibu_kakek },
        body.total_harta,
      )
    }

    // Ada cucu laki-laki
    if (cucu_laki_laki > 0) {
      return this.haveGrandSon(
        { cucu_laki_laki, anak_perempuan, cucu_perempuan, ayah, kakek, suami, istri, ibu, nenek, ibu_kakek },
        body.total_harta,
      )
    }

    // Ada anak perempuan atau cucu perempuan
    if (anak_perempuan > 0 || cucu_perempuan > 0) {
      return this.haveDaughterAndGrand(
        {
          anak_perempuan,
          cucu_perempuan,
          ayah,
          kakek,
          suami,
          istri,
          ibu,
          nenek,
          ibu_kakek,
          saudara_kandung,
          saudari_kandung,
          saudara_tiri_seayah,
          saudari_seayah,
          anak_laki_laki_saudara_kandung,
          anak_laki_laki_saudara_tiri_seayah,
          saudara_kandung_ayah,
          saudara_tiri_seayah_ayah,
          anak_laki_laki_saudara_kandung_ayah,
          anak_laki_laki_saudara_tiri_seayah_ayah,
        },
        body.total_harta,
      )
    }

    // Ada ayah atau kakek
    if (ayah > 0 || kakek > 0) {
      return this.haveFatherAndGrand(
        { ayah, kakek, ibu, nenek, ibu_kakek, suami, istri },
        body.total_harta,
      )
    }

    // Ada saudara kandung atau saudara seayah
    if (saudara_kandung > 0 || saudara_tiri_seayah > 0) {
      return this.haveSiblings(
        {
          saudara_saudari_tiri_seibu,
          saudara_kandung,
          saudari_kandung,
          saudara_tiri_seayah,
          saudari_seayah,
          suami,
          istri,
          ibu,
          nenek,
          ibu_kakek,
        },
        body.total_harta,
      )
    }

    // Ahli waris lainnya
    return this.haveAnother(
      {
        anak_laki_laki_saudara_kandung,
        anak_laki_laki_saudara_tiri_seayah,
        saudara_kandung_ayah,
        saudara_tiri_seayah_ayah,
        anak_laki_laki_saudara_kandung_ayah,
        anak_laki_laki_saudara_tiri_seayah_ayah,
        saudari_kandung,
        saudari_seayah,
        suami,
        istri,
        ibu,
        nenek,
        ibu_kakek,
        saudara_saudari_tiri_seibu,
        pria_wanita_yang_memerdekakan_budak,
      },
      body.total_harta,
    )
  }

  // =======================================
  //        JIKA PUNYA ANAK LAKI-LAKI
  // =======================================
  static haveSon(body, funds) {
    const { anak_laki_laki, anak_perempuan, ayah, kakek, suami, istri, ibu, nenek, ibu_kakek } = body
    const result = []

    if (ayah > 0) result.push(new PenerimaWaris('ayah', '1/6', 1))
    else if (kakek > 0) result.push(new PenerimaWaris('kakek', '1/6', 1))

    if (suami > 0) result.push(new PenerimaWaris('suami', '1/4', 1))
    else if (istri > 0) result.push(new PenerimaWaris('istri', '1/8', istri))

    if (ibu > 0) result.push(new PenerimaWaris('ibu', '1/6', 1))
    else if (nenek > 0) result.push(new PenerimaWaris('nenek', '1/6', 1))
    else if (ibu_kakek > 0) result.push(new PenerimaWaris('ibu_kakek', '1/6', 1))

    let aK, sI, iN
    let penyebut = 0
    let pembilangSementara = 1
    const findKPK = []
    for (const i in result) {
      if (result[i].nama === 'ayah' || result[i].nama === 'kakek') {
        aK = result[i].bagian_hukum_waris.split('/')
        findKPK.push(+aK[1])
        pembilangSementara *= +aK[1]
      } else if (result[i].nama === 'suami' || result[i].nama === 'istri') {
        sI = result[i].bagian_hukum_waris.split('/')
        findKPK.push(+sI[1])
        pembilangSementara *= +sI[1]
      } else if (result[i].nama === 'ibu' || result[i].nama === 'nenek' || result[i].nama === 'ibu_kakek') {
        iN = result[i].bagian_hukum_waris.split('/')
        findKPK.push(+iN[1])
        pembilangSementara *= +iN[1]
      }
    }

    if (findKPK.length > 0) pembilangSementara = kpk(findKPK, pembilangSementara)

    if (aK) {
      aK[0] = (pembilangSementara / +aK[1]) * aK[0]
      penyebut = aK[0]
    }
    if (sI) {
      sI[0] = (pembilangSementara / +sI[1]) * sI[0]
      penyebut += sI[0]
    }
    if (iN) {
      iN[0] = (pembilangSementara / +iN[1]) * iN[0]
      penyebut += iN[0]
    }

    const pembilang = penyebut > pembilangSementara ? penyebut : pembilangSementara

    if (aK) {
      aK[1] = pembilang
      const idx = dataIndex(['ayah', 'kakek'], 'nama', result)
      result[idx].bagian_terhitung = aK.join('/')
      result[idx].updateFunds((aK[0] * funds) / pembilang)
    }
    if (sI) {
      sI[1] = pembilang
      const idx = dataIndex(['suami', 'istri'], 'nama', result)
      result[idx].bagian_terhitung = sI.join('/')
      result[idx].updateFunds((sI[0] * funds) / pembilang)
    }
    if (iN) {
      iN[1] = pembilang
      const idx = dataIndex(['ibu', 'nenek', 'ibu_kakek'], 'nama', result)
      result[idx].bagian_terhitung = iN.join('/')
      result[idx].updateFunds((iN[0] * funds) / pembilang)
    }

    const sisaPenyebut = pembilang - penyebut
    const lastFunds = (sisaPenyebut * funds) / pembilang

    if (anak_perempuan > 0) {
      result.unshift(new PenerimaWaris('anak_perempuan', '1/2 bagian anak laki-laki', anak_perempuan))
      result.unshift(new PenerimaWaris('anak_laki_laki', '2 kali lipat anak perempuan', anak_laki_laki))
      const pembilangAnak = anak_laki_laki * 2 + anak_perempuan
      const idxLk = dataIndex(['anak_laki_laki'], 'nama', result)
      result[idxLk].updateCountPart(
        `${anak_laki_laki * 2}/${pembilangAnak} dari sisa ${sisaPenyebut}/${pembilang}`,
      )
      result[idxLk].updateFunds(((anak_laki_laki * 2) * lastFunds) / pembilangAnak)
      const idxPr = dataIndex(['anak_perempuan'], 'nama', result)
      result[idxPr].updateCountPart(
        `${anak_perempuan}/${pembilangAnak} dari sisa ${sisaPenyebut}/${pembilang}`,
      )
      result[idxPr].updateFunds((anak_perempuan * lastFunds) / pembilangAnak)
    } else {
      result.unshift(new PenerimaWaris('anak_laki_laki', 'Sisa pembagian seluruh harta', anak_laki_laki))
      const idx = dataIndex(['anak_laki_laki'], 'nama', result)
      result[idx].updateCountPart(`${sisaPenyebut}/${pembilang}`)
      result[idx].updateFunds(lastFunds)
    }

    return result
  }

  // =======================================
  //        JIKA PUNYA CUCU LAKI-LAKI
  // =======================================
  static haveGrandSon(body, funds) {
    const { cucu_laki_laki, anak_perempuan, cucu_perempuan, ayah, kakek, suami, istri, ibu, nenek, ibu_kakek } = body
    const result = []

    if (anak_perempuan > 0) {
      if (anak_perempuan > 1) result.push(new PenerimaWaris('anak_perempuan', '2/3', anak_perempuan))
      else result.push(new PenerimaWaris('anak_perempuan', '1/2', 1))
    }

    if (ayah > 0) result.push(new PenerimaWaris('ayah', '1/6', 1))
    else if (kakek > 0) result.push(new PenerimaWaris('kakek', '1/6', 1))

    if (suami > 0) result.push(new PenerimaWaris('suami', '1/4', 1))
    else if (istri > 0) result.push(new PenerimaWaris('istri', '1/8', istri))

    if (ibu > 0) result.push(new PenerimaWaris('ibu', '1/6', 1))
    else if (nenek > 0) result.push(new PenerimaWaris('nenek', '1/6', 1))
    else if (ibu_kakek > 0) result.push(new PenerimaWaris('ibu_kakek', '1/6', 1))

    let aP, aK, sI, iN
    let penyebut = 0
    let pembilangSementara = 1
    const findKPK = []
    for (const i in result) {
      if (result[i].nama === 'anak_perempuan') {
        aP = result[i].bagian_hukum_waris.split('/')
        findKPK.push(+aP[1])
        pembilangSementara *= +aP[1]
      }
      if (result[i].nama === 'ayah' || result[i].nama === 'kakek') {
        aK = result[i].bagian_hukum_waris.split('/')
        findKPK.push(+aK[1])
        pembilangSementara *= +aK[1]
      } else if (result[i].nama === 'suami' || result[i].nama === 'istri') {
        sI = result[i].bagian_hukum_waris.split('/')
        findKPK.push(+sI[1])
        pembilangSementara *= +sI[1]
      } else if (result[i].nama === 'ibu' || result[i].nama === 'nenek' || result[i].nama === 'ibu_kakek') {
        iN = result[i].bagian_hukum_waris.split('/')
        findKPK.push(+iN[1])
        pembilangSementara *= +iN[1]
      }
    }

    if (findKPK.length > 0) pembilangSementara = kpk(findKPK, pembilangSementara)

    if (aP) {
      aP[0] = (pembilangSementara / +aP[1]) * aP[0]
      penyebut += aP[0]
    }
    if (aK) {
      aK[0] = (pembilangSementara / +aK[1]) * aK[0]
      penyebut += aK[0]
    }
    if (sI) {
      sI[0] = (pembilangSementara / +sI[1]) * sI[0]
      penyebut += sI[0]
    }
    if (iN) {
      iN[0] = (pembilangSementara / +iN[1]) * iN[0]
      penyebut += iN[0]
    }

    const pembilang = penyebut > pembilangSementara ? penyebut : pembilangSementara

    if (aP) {
      aP[1] = pembilang
      const idx = dataIndex(['anak_perempuan'], 'nama', result)
      result[idx].bagian_terhitung = aP.join('/')
      result[idx].updateFunds((aP[0] * funds) / pembilang)
    }
    if (aK) {
      aK[1] = pembilang
      const idx = dataIndex(['ayah', 'kakek'], 'nama', result)
      result[idx].bagian_terhitung = aK.join('/')
      result[idx].updateFunds((aK[0] * funds) / pembilang)
    }
    if (sI) {
      sI[1] = pembilang
      const idx = dataIndex(['suami', 'istri'], 'nama', result)
      result[idx].bagian_terhitung = sI.join('/')
      result[idx].updateFunds((sI[0] * funds) / pembilang)
    }
    if (iN) {
      iN[1] = pembilang
      const idx = dataIndex(['ibu', 'nenek', 'ibu_kakek'], 'nama', result)
      result[idx].bagian_terhitung = iN.join('/')
      result[idx].updateFunds((iN[0] * funds) / pembilang)
    }

    const sisaPenyebut = pembilang - penyebut
    const lastFunds = (sisaPenyebut * funds) / pembilang

    if (cucu_perempuan > 0) {
      result.unshift(new PenerimaWaris('cucu_perempuan', '1/2 bagian cucu laki-laki', cucu_perempuan))
      result.unshift(new PenerimaWaris('cucu_laki_laki', '2 kali lipat cucu perempuan', cucu_laki_laki))
      const pembilangCucu = cucu_laki_laki * 2 + cucu_perempuan
      const idxLk = dataIndex(['cucu_laki_laki'], 'nama', result)
      result[idxLk].updateCountPart(
        `${cucu_laki_laki * 2}/${pembilangCucu} dari sisa ${sisaPenyebut}/${pembilang}`,
      )
      result[idxLk].updateFunds(((cucu_laki_laki * 2) * lastFunds) / pembilangCucu)
      const idxPr = dataIndex(['cucu_perempuan'], 'nama', result)
      result[idxPr].updateCountPart(
        `${cucu_perempuan}/${pembilangCucu} dari sisa ${sisaPenyebut}/${pembilang}`,
      )
      result[idxPr].updateFunds((cucu_perempuan * lastFunds) / pembilangCucu)
    } else {
      result.unshift(new PenerimaWaris('cucu_laki_laki', 'Sisa pembagian seluruh harta', cucu_laki_laki))
      const idx = dataIndex(['cucu_laki_laki'], 'nama', result)
      result[idx].updateCountPart(`${sisaPenyebut}/${pembilang}`)
      result[idx].updateFunds(lastFunds)
    }

    return result
  }

  // ===============================================
  //  JIKA PUNYA ANAK PEREMPUAN ATAU CUCU PEREMPUAN
  // ===============================================
  static haveDaughterAndGrand(body, funds) {
    const {
      anak_perempuan,
      cucu_perempuan,
      ayah,
      kakek,
      suami,
      istri,
      ibu,
      nenek,
      ibu_kakek,
      saudara_kandung,
      saudari_kandung,
      saudara_tiri_seayah,
      saudari_seayah,
      anak_laki_laki_saudara_kandung,
      anak_laki_laki_saudara_tiri_seayah,
      saudara_kandung_ayah,
      saudara_tiri_seayah_ayah,
      anak_laki_laki_saudara_kandung_ayah,
      anak_laki_laki_saudara_tiri_seayah_ayah,
    } = body
    const result = []

    if (anak_perempuan > 0) {
      if (anak_perempuan > 1) {
        result.push(new PenerimaWaris('anak_perempuan', '2/3', anak_perempuan))
      } else {
        result.push(new PenerimaWaris('anak_perempuan', '1/2', 1))
        if (cucu_perempuan > 0) result.push(new PenerimaWaris('cucu_perempuan', '1/6', cucu_perempuan))
      }
    } else if (cucu_perempuan > 0) {
      if (cucu_perempuan > 1) result.push(new PenerimaWaris('cucu_perempuan', '2/3', cucu_perempuan))
      else result.push(new PenerimaWaris('cucu_perempuan', '1/2', 1))
    }

    if (ayah > 0) {
      result.push(new PenerimaWaris('ayah', '1/6', 1))
    } else if (kakek > 0) {
      result.push(new PenerimaWaris('kakek', '1/6', 1))
    } else if (saudara_kandung > 0) {
      if (saudari_kandung > 0) {
        result.push(new PenerimaWaris('saudara_kandung', '2 kali lipat saudari kandung', saudara_kandung))
        result.push(new PenerimaWaris('saudari_kandung', 'setengah bagian saudara kandung', saudari_kandung))
      } else {
        result.push(new PenerimaWaris('saudara_kandung', 'sisa pembagian seluruh harta', saudara_kandung))
      }
    } else if (saudari_kandung > 0) {
      result.push(new PenerimaWaris('saudari_kandung', 'sisa pembagian seluruh harta', saudari_kandung))
    } else if (saudara_tiri_seayah > 0) {
      if (saudari_seayah > 0) {
        result.push(new PenerimaWaris('saudara_tiri_seayah', '2 kali lipat saudari seayah', saudara_tiri_seayah))
        result.push(new PenerimaWaris('saudari_seayah', 'setengah bagian saudara seayah', saudari_seayah))
      } else {
        result.push(new PenerimaWaris('saudara_tiri_seayah', 'sisa pembagian seluruh harta', saudara_tiri_seayah))
      }
    } else if (saudari_seayah > 0) {
      result.push(new PenerimaWaris('saudari_seayah', 'sisa pembagian seluruh harta', saudari_seayah))
    } else if (anak_laki_laki_saudara_kandung > 0) {
      result.push(
        new PenerimaWaris(
          'anak_laki_laki_saudara_kandung',
          'sisa pembagian seluruh harta',
          anak_laki_laki_saudara_kandung,
        ),
      )
    } else if (anak_laki_laki_saudara_tiri_seayah > 0) {
      result.push(
        new PenerimaWaris(
          'anak_laki_laki_saudara_tiri_seayah',
          'sisa pembagian seluruh harta',
          anak_laki_laki_saudara_tiri_seayah,
        ),
      )
    } else if (saudara_kandung_ayah > 0) {
      result.push(new PenerimaWaris('saudara_kandung_ayah', 'sisa pembagian seluruh harta', saudara_kandung_ayah))
    } else if (saudara_tiri_seayah_ayah > 0) {
      result.push(
        new PenerimaWaris('saudara_tiri_seayah_ayah', 'sisa pembagian seluruh harta', saudara_tiri_seayah_ayah),
      )
    } else if (anak_laki_laki_saudara_kandung_ayah > 0) {
      result.push(
        new PenerimaWaris(
          'anak_laki_laki_saudara_kandung_ayah',
          'sisa pembagian seluruh harta',
          anak_laki_laki_saudara_kandung_ayah,
        ),
      )
    } else if (anak_laki_laki_saudara_tiri_seayah_ayah > 0) {
      result.push(
        new PenerimaWaris(
          'anak_laki_laki_saudara_tiri_seayah_ayah',
          'sisa pembagian seluruh harta',
          anak_laki_laki_saudara_tiri_seayah_ayah,
        ),
      )
    } else {
      result.push(new PenerimaWaris('dzawil_arhaam', 'sisa pembagian seluruh harta', 1))
    }

    if (suami > 0) result.push(new PenerimaWaris('suami', '1/4', 1))
    else if (istri > 0) result.push(new PenerimaWaris('istri', '1/8', istri))

    if (ibu > 0) result.push(new PenerimaWaris('ibu', '1/6', 1))
    else if (nenek > 0) result.push(new PenerimaWaris('nenek', '1/6', 1))
    else if (ibu_kakek > 0) result.push(new PenerimaWaris('ibu_kakek', '1/6', 1))

    let aP, cP, aK, sI, iN
    let penyebut = 0
    let pembilangSementara = 1
    const findKPK = []
    for (const i in result) {
      if (result[i].nama === 'anak_perempuan') {
        aP = result[i].bagian_hukum_waris.split('/')
        findKPK.push(+aP[1])
        pembilangSementara *= +aP[1]
      }
      if (result[i].nama === 'cucu_perempuan') {
        cP = result[i].bagian_hukum_waris.split('/')
        // Sumber asli menulis +aP[1] di sini; itu TypeError saat kasus hanya
        // punya cucu perempuan tanpa anak perempuan.
        findKPK.push(+cP[1])
        pembilangSementara *= +cP[1]
      }
      if (result[i].nama === 'ayah' || result[i].nama === 'kakek') {
        aK = result[i].bagian_hukum_waris.split('/')
        findKPK.push(+aK[1])
        pembilangSementara *= +aK[1]
      } else if (result[i].nama === 'suami' || result[i].nama === 'istri') {
        sI = result[i].bagian_hukum_waris.split('/')
        findKPK.push(+sI[1])
        pembilangSementara *= +sI[1]
      } else if (result[i].nama === 'ibu' || result[i].nama === 'nenek' || result[i].nama === 'ibu_kakek') {
        iN = result[i].bagian_hukum_waris.split('/')
        findKPK.push(+iN[1])
        pembilangSementara *= +iN[1]
      }
    }

    if (findKPK.length > 0) pembilangSementara = kpk(findKPK, pembilangSementara)

    if (aP) {
      aP[0] = (pembilangSementara / +aP[1]) * aP[0]
      penyebut += aP[0]
    }
    if (cP) {
      cP[0] = (pembilangSementara / +cP[1]) * cP[0]
      penyebut += cP[0]
    }
    if (aK) {
      aK[0] = (pembilangSementara / +aK[1]) * aK[0]
      penyebut += aK[0]
    }
    if (sI) {
      sI[0] = (pembilangSementara / +sI[1]) * sI[0]
      penyebut += sI[0]
    }
    if (iN) {
      iN[0] = (pembilangSementara / +iN[1]) * iN[0]
      penyebut += iN[0]
    }

    const pembilang = penyebut > pembilangSementara ? penyebut : pembilangSementara

    if (aP) {
      aP[1] = pembilang
      const idx = dataIndex(['anak_perempuan'], 'nama', result)
      result[idx].bagian_terhitung = aP.join('/')
      result[idx].updateFunds((aP[0] * funds) / pembilang)
    }
    if (cP) {
      cP[1] = pembilang
      const idx = dataIndex(['cucu_perempuan'], 'nama', result)
      result[idx].bagian_terhitung = cP.join('/')
      result[idx].updateFunds((cP[0] * funds) / pembilang)
    }
    if (aK) {
      aK[1] = pembilang
      const idx = dataIndex(['ayah', 'kakek'], 'nama', result)
      result[idx].bagian_terhitung = aK.join('/')
      result[idx].updateFunds((aK[0] * funds) / pembilang)
    }
    if (sI) {
      sI[1] = pembilang
      const idx = dataIndex(['suami', 'istri'], 'nama', result)
      result[idx].bagian_terhitung = sI.join('/')
      result[idx].updateFunds((sI[0] * funds) / pembilang)
    }
    if (iN) {
      iN[1] = pembilang
      const idx = dataIndex(['ibu', 'nenek', 'ibu_kakek'], 'nama', result)
      result[idx].bagian_terhitung = iN.join('/')
      result[idx].updateFunds((iN[0] * funds) / pembilang)
    }

    const sisaPenyebut = pembilang - penyebut
    const lastFunds = (sisaPenyebut * funds) / pembilang

    // Penerima yang bagian_terhitung-nya masih kosong = penerima "sisa" (ashabah).
    const idxSisa = dataIndex([''], 'bagian_terhitung', result)
    const namaSisa = idxSisa !== -1 ? result[idxSisa].nama : ''

    if (ayah > 0 || kakek > 0) {
      const idx = dataIndex(['ayah', 'kakek'], 'nama', result)
      result[idx].bagian_terhitung += ` + sisa ${sisaPenyebut}/${pembilang}`
      result[idx].updateFunds(result[idx].dana_didapat + lastFunds)
    } else if (
      namaSisa === 'saudara_kandung' ||
      namaSisa === 'saudari_kandung' ||
      namaSisa === 'saudara_tiri_seayah' ||
      namaSisa === 'saudari_seayah'
    ) {
      if (saudara_kandung > 0) {
        if (saudari_kandung > 0) {
          const pembilangBaru = saudara_kandung * 2 + saudari_kandung
          const idxLk = dataIndex(['saudara_kandung'], 'nama', result)
          result[idxLk].updateCountPart(
            `${saudara_kandung * 2}/${pembilangBaru} dari sisa ${sisaPenyebut}/${pembilang}`,
          )
          result[idxLk].updateFunds(((saudara_kandung * 2) * lastFunds) / pembilangBaru)
          const idxPr = dataIndex(['saudari_kandung'], 'nama', result)
          result[idxPr].updateCountPart(
            `${saudari_kandung}/${pembilangBaru} dari sisa ${sisaPenyebut}/${pembilang}`,
          )
          result[idxPr].updateFunds((saudari_kandung * lastFunds) / pembilangBaru)
        } else {
          result[idxSisa].updateCountPart(`${sisaPenyebut}/${pembilang}`)
          result[idxSisa].updateFunds(lastFunds)
        }
      } else if (saudari_kandung > 0) {
        result[idxSisa].updateCountPart(`${sisaPenyebut}/${pembilang}`)
        result[idxSisa].updateFunds(lastFunds)
      } else if (saudara_tiri_seayah > 0) {
        if (saudari_seayah > 0) {
          const pembilangBaru = saudara_tiri_seayah * 2 + saudari_seayah
          const idxLk = dataIndex(['saudara_tiri_seayah'], 'nama', result)
          result[idxLk].updateCountPart(
            `${saudara_tiri_seayah * 2}/${pembilangBaru} dari sisa ${sisaPenyebut}/${pembilang}`,
          )
          result[idxLk].updateFunds(((saudara_tiri_seayah * 2) * lastFunds) / pembilangBaru)
          const idxPr = dataIndex(['saudari_seayah'], 'nama', result)
          result[idxPr].updateCountPart(
            `${saudari_seayah}/${pembilangBaru} dari sisa ${sisaPenyebut}/${pembilang}`,
          )
          result[idxPr].updateFunds((saudari_seayah * lastFunds) / pembilangBaru)
        } else {
          result[idxSisa].updateCountPart(`${sisaPenyebut}/${pembilang}`)
          result[idxSisa].updateFunds(lastFunds)
        }
      } else if (saudari_seayah > 0) {
        result[idxSisa].updateCountPart(`${sisaPenyebut}/${pembilang}`)
        result[idxSisa].updateFunds(lastFunds)
      }
    } else if (idxSisa !== -1) {
      result[idxSisa].updateCountPart(`${sisaPenyebut}/${pembilang}`)
      result[idxSisa].updateFunds(lastFunds)
    }

    return result
  }

  // =======================================
  //       JIKA PUNYA AYAH ATAU KAKEK
  // =======================================
  static haveFatherAndGrand(body, funds) {
    const { ayah, kakek, ibu, nenek, ibu_kakek, suami, istri } = body
    const result = []

    if (suami > 0 || istri > 0) {
      if (suami > 0) result.push(new PenerimaWaris('suami', '1/2', 1))
      else if (istri > 0) result.push(new PenerimaWaris('istri', '1/4', istri))
      result.push(new PenerimaWaris('ibu', '1/3 dari sisa pembagian seluruh harta', 1))
    } else if (ibu > 0) {
      result.push(new PenerimaWaris('ibu', '1/3', 1))
    }

    if (ibu < 1) {
      if (nenek > 0) result.push(new PenerimaWaris('nenek', '1/6', 1))
      else if (ibu_kakek > 0) result.push(new PenerimaWaris('ibu_kakek', '1/6', 1))
    }

    let sI, iN
    let penyebut = 0
    let pembilangSementara = 1
    const findKPK = []
    for (const i in result) {
      if (result[i].nama === 'suami' || result[i].nama === 'istri') {
        sI = result[i].bagian_hukum_waris.split('/')
        findKPK.push(+sI[1])
        pembilangSementara *= +sI[1]
      } else if (
        (result[i].nama === 'ibu' && result[i].bagian_didapat === '1/3') ||
        result[i].nama === 'nenek' ||
        result[i].nama === 'ibu_kakek'
      ) {
        iN = result[i].bagian_hukum_waris.split('/')
        findKPK.push(+iN[1])
        pembilangSementara *= +iN[1]
      }
    }

    if (findKPK.length > 0) pembilangSementara = kpk(findKPK, pembilangSementara)

    if (sI) {
      sI[0] = (pembilangSementara / +sI[1]) * sI[0]
      penyebut += sI[0]
    }
    if (iN) {
      iN[0] = (pembilangSementara / +iN[1]) * iN[0]
      penyebut += iN[0]
    }

    const pembilang = penyebut > pembilangSementara ? penyebut : pembilangSementara

    if (sI) {
      sI[1] = pembilang
      const idx = dataIndex(['suami', 'istri'], 'nama', result)
      result[idx].bagian_terhitung = sI.join('/')
      result[idx].updateFunds((sI[0] * funds) / pembilang)
    }
    if (iN) {
      iN[1] = pembilang
      const idx = dataIndex(['ibu', 'nenek', 'ibu_kakek'], 'nama', result)
      result[idx].bagian_terhitung = iN.join('/')
      result[idx].updateFunds((iN[0] * funds) / pembilang)
    }

    const sisaPenyebut = pembilang - penyebut
    let lastFunds = (sisaPenyebut * funds) / pembilang
    let text = ''

    const idxIbu = dataIndex(['ibu'], 'nama', result)
    if (ibu > 0 && result[idxIbu].bagian_didapat !== '1/3') {
      result[idxIbu].updateCountPart(`1/3 dari ${sisaPenyebut}/${pembilang}`)
      result[idxIbu].updateFunds(lastFunds / 3)
      lastFunds -= lastFunds / 3
      text = ' - 1/3 bagian ibu'
    }

    const nama = ayah > 0 ? 'ayah' : 'kakek'
    result.unshift(new PenerimaWaris(nama, 'Sisa pembagian seluruh harta', 1))
    const idx = dataIndex([nama], 'nama', result)
    result[idx].updateCountPart(`${sisaPenyebut}/${pembilang}${text}`)
    result[idx].updateFunds(lastFunds)

    return result
  }

  // ================================================
  //  JIKA PUNYA SAUDARA KANDUNG ATAU SAUDARA SEAYAH
  // ================================================
  static haveSiblings(body, funds) {
    const {
      saudara_saudari_tiri_seibu,
      saudara_kandung,
      saudari_kandung,
      saudara_tiri_seayah,
      saudari_seayah,
      suami,
      istri,
      ibu,
      nenek,
      ibu_kakek,
    } = body
    const result = []

    if (saudara_saudari_tiri_seibu > 0) {
      if (saudara_saudari_tiri_seibu > 1) {
        result.push(new PenerimaWaris('saudara_saudari_tiri_seibu', '1/3', saudara_saudari_tiri_seibu))
      } else {
        result.push(new PenerimaWaris('saudara_saudari_tiri_seibu', '1/6', saudara_saudari_tiri_seibu))
      }
    }

    if (suami > 0) result.push(new PenerimaWaris('suami', '1/2', 1))
    else if (istri > 0) result.push(new PenerimaWaris('istri', '1/4', istri))

    if (ibu > 0) result.push(new PenerimaWaris('ibu', '1/6', 1))
    else if (nenek > 0) result.push(new PenerimaWaris('nenek', '1/6', 1))
    else if (ibu_kakek > 0) result.push(new PenerimaWaris('ibu_kakek', '1/6', 1))

    if (saudara_kandung < 1 && saudari_kandung > 0) {
      if (saudari_kandung > 1) result.push(new PenerimaWaris('saudari_kandung', '2/3', saudari_kandung))
      else result.push(new PenerimaWaris('saudari_kandung', '1/2', 1))
    }

    let ssI, sI, iN, sK
    let penyebut = 0
    let pembilangSementara = 1
    const findKPK = []
    for (const i in result) {
      if (result[i].nama === 'saudara_saudari_tiri_seibu') {
        ssI = result[i].bagian_hukum_waris.split('/')
        findKPK.push(+ssI[1])
        pembilangSementara *= +ssI[1]
      } else if (result[i].nama === 'suami' || result[i].nama === 'istri') {
        sI = result[i].bagian_hukum_waris.split('/')
        findKPK.push(+sI[1])
        pembilangSementara *= +sI[1]
      } else if (result[i].nama === 'ibu' || result[i].nama === 'nenek' || result[i].nama === 'ibu_kakek') {
        iN = result[i].bagian_hukum_waris.split('/')
        findKPK.push(+iN[1])
        pembilangSementara *= +iN[1]
      } else if (result[i].nama === 'saudari_kandung') {
        sK = result[i].bagian_hukum_waris.split('/')
        findKPK.push(+sK[1])
        pembilangSementara *= +sK[1]
      }
    }

    if (findKPK.length > 0) pembilangSementara = kpk(findKPK, pembilangSementara)

    if (ssI) {
      ssI[0] = (pembilangSementara / +ssI[1]) * ssI[0]
      penyebut += ssI[0]
    }
    if (sI) {
      sI[0] = (pembilangSementara / +sI[1]) * sI[0]
      penyebut += sI[0]
    }
    if (iN) {
      iN[0] = (pembilangSementara / +iN[1]) * iN[0]
      penyebut += iN[0]
    }
    if (sK) {
      sK[0] = (pembilangSementara / +sK[1]) * sK[0]
      penyebut += sK[0]
    }

    const pembilang = penyebut > pembilangSementara ? penyebut : pembilangSementara

    if (ssI) {
      ssI[1] = pembilang
      const idx = dataIndex(['saudara_saudari_tiri_seibu'], 'nama', result)
      result[idx].bagian_terhitung = ssI.join('/')
      result[idx].updateFunds((ssI[0] * funds) / pembilang)
    }
    if (sI) {
      sI[1] = pembilang
      const idx = dataIndex(['suami', 'istri'], 'nama', result)
      result[idx].bagian_terhitung = sI.join('/')
      result[idx].updateFunds((sI[0] * funds) / pembilang)
    }
    if (iN) {
      iN[1] = pembilang
      const idx = dataIndex(['ibu', 'nenek', 'ibu_kakek'], 'nama', result)
      result[idx].bagian_terhitung = iN.join('/')
      result[idx].updateFunds((iN[0] * funds) / pembilang)
    }
    if (sK) {
      sK[1] = pembilang
      const idx = dataIndex(['saudari_kandung'], 'nama', result)
      result[idx].bagian_terhitung = sK.join('/')
      result[idx].updateFunds((sK[0] * funds) / pembilang)
    }

    const sisaPenyebut = pembilang - penyebut
    const lastFunds = (sisaPenyebut * funds) / pembilang

    const name =
      saudara_kandung > 0 ? ['saudara_kandung', 'saudari_kandung'] : ['saudara_tiri_seayah', 'saudari_seayah']
    const jmlLk = jumlahAtauSatu(body[name[0]])
    const jmlPr = jumlahAtauSatu(body[name[1]])

    if (saudari_seayah > 0 || (saudara_tiri_seayah < 1 && saudari_kandung > 0)) {
      result.unshift(new PenerimaWaris(name[1], `1/2 bagian ${name[0]}`, jmlPr))
      result.unshift(new PenerimaWaris(name[0], `2 kali lipat ${name[1]}`, jmlLk))
      const pembilangBaru = jmlLk * 2 + jmlPr
      const idxLk = dataIndex([name[0]], 'nama', result)
      result[idxLk].updateCountPart(`${jmlLk * 2}/${pembilangBaru} dari sisa ${sisaPenyebut}/${pembilang}`)
      result[idxLk].updateFunds(((jmlLk * 2) * lastFunds) / pembilangBaru)
      const idxPr = dataIndex([name[1]], 'nama', result)
      result[idxPr].updateCountPart(`${jmlPr}/${pembilangBaru} dari sisa ${sisaPenyebut}/${pembilang}`)
      result[idxPr].updateFunds((jmlPr * lastFunds) / pembilangBaru)
    } else {
      result.unshift(new PenerimaWaris(name[0], 'Sisa pembagian seluruh harta', jmlLk))
      const idx = dataIndex([name[0]], 'nama', result)
      result[idx].updateCountPart(`${sisaPenyebut}/${pembilang}`)
      result[idx].updateFunds(lastFunds)
    }

    return result
  }

  // =======================================
  //           AHLI WARIS LAINNYA
  // =======================================
  static haveAnother(body, funds) {
    const {
      anak_laki_laki_saudara_kandung,
      anak_laki_laki_saudara_tiri_seayah,
      saudara_kandung_ayah,
      saudara_tiri_seayah_ayah,
      anak_laki_laki_saudara_kandung_ayah,
      anak_laki_laki_saudara_tiri_seayah_ayah,
      saudari_kandung,
      saudari_seayah,
      suami,
      istri,
      ibu,
      nenek,
      ibu_kakek,
      saudara_saudari_tiri_seibu,
      pria_wanita_yang_memerdekakan_budak,
    } = body
    const result = []

    if (saudara_saudari_tiri_seibu > 0) {
      if (saudara_saudari_tiri_seibu > 1) {
        result.push(new PenerimaWaris('saudara_saudari_tiri_seibu', '1/3', saudara_saudari_tiri_seibu))
      } else {
        result.push(new PenerimaWaris('saudara_saudari_tiri_seibu', '1/6', saudara_saudari_tiri_seibu))
      }
    }

    if (suami > 0) result.push(new PenerimaWaris('suami', '1/2', 1))
    else if (istri > 0) result.push(new PenerimaWaris('istri', '1/4', istri))

    if (ibu > 0) {
      if (saudari_kandung < 1 && saudari_seayah < 1) result.push(new PenerimaWaris('ibu', '1/3', 1))
      else result.push(new PenerimaWaris('ibu', '1/6', 1))
    } else if (nenek > 0) {
      result.push(new PenerimaWaris('nenek', '1/6', 1))
    } else if (ibu_kakek > 0) {
      result.push(new PenerimaWaris('ibu_kakek', '1/6', 1))
    }

    if (saudari_kandung > 0) {
      if (saudari_kandung > 1) result.push(new PenerimaWaris('saudari_kandung', '2/3', saudari_kandung))
      else result.push(new PenerimaWaris('saudari_kandung', '1/2', 1))
    } else if (saudari_seayah > 0) {
      if (saudari_seayah > 1) result.push(new PenerimaWaris('saudari_seayah', '2/3', saudari_seayah))
      else result.push(new PenerimaWaris('saudari_seayah', '1/2', 1))
    }

    let ssI, sI, iN, sKA
    let penyebut = 0
    let pembilangSementara = 1
    const findKPK = []
    for (const i in result) {
      if (result[i].nama === 'suami' || result[i].nama === 'istri') {
        sI = result[i].bagian_hukum_waris.split('/')
        findKPK.push(+sI[1])
        pembilangSementara *= +sI[1]
      } else if (result[i].nama === 'ibu' || result[i].nama === 'nenek' || result[i].nama === 'ibu_kakek') {
        iN = result[i].bagian_hukum_waris.split('/')
        findKPK.push(+iN[1])
        pembilangSementara *= +iN[1]
      } else if (result[i].nama === 'saudari_kandung' || result[i].nama === 'saudari_seayah') {
        sKA = result[i].bagian_hukum_waris.split('/')
        findKPK.push(+sKA[1])
        pembilangSementara *= +sKA[1]
      } else if (result[i].nama === 'saudara_saudari_tiri_seibu') {
        ssI = result[i].bagian_hukum_waris.split('/')
        findKPK.push(+ssI[1])
        pembilangSementara *= +ssI[1]
      }
    }

    if (findKPK.length > 0) pembilangSementara = kpk(findKPK, pembilangSementara)

    if (ssI) {
      ssI[0] = (pembilangSementara / +ssI[1]) * ssI[0]
      penyebut += ssI[0]
    }
    if (sI) {
      sI[0] = (pembilangSementara / +sI[1]) * sI[0]
      penyebut += sI[0]
    }
    if (iN) {
      iN[0] = (pembilangSementara / +iN[1]) * iN[0]
      penyebut += iN[0]
    }
    if (sKA) {
      sKA[0] = (pembilangSementara / +sKA[1]) * sKA[0]
      penyebut += sKA[0]
    }

    const pembilang = penyebut > pembilangSementara ? penyebut : pembilangSementara

    if (ssI) {
      ssI[1] = pembilang
      const idx = dataIndex(['saudara_saudari_tiri_seibu'], 'nama', result)
      result[idx].bagian_terhitung = ssI.join('/')
      result[idx].updateFunds((ssI[0] * funds) / pembilang)
    }
    if (sI) {
      sI[1] = pembilang
      const idx = dataIndex(['suami', 'istri'], 'nama', result)
      result[idx].bagian_terhitung = sI.join('/')
      result[idx].updateFunds((sI[0] * funds) / pembilang)
    }
    if (iN) {
      iN[1] = pembilang
      const idx = dataIndex(['ibu', 'nenek', 'ibu_kakek'], 'nama', result)
      result[idx].bagian_terhitung = iN.join('/')
      result[idx].updateFunds((iN[0] * funds) / pembilang)
    }
    if (sKA) {
      sKA[1] = pembilang
      const idx = dataIndex(['saudari_kandung', 'saudari_seayah'], 'nama', result)
      result[idx].bagian_terhitung = sKA.join('/')
      result[idx].updateFunds((sKA[0] * funds) / pembilang)
    }

    const sisaPenyebut = pembilang - penyebut
    const lastFunds = (sisaPenyebut * funds) / pembilang

    let name
    if (anak_laki_laki_saudara_kandung > 0) name = 'anak_laki_laki_saudara_kandung'
    else if (anak_laki_laki_saudara_tiri_seayah > 0) name = 'anak_laki_laki_saudara_tiri_seayah'
    else if (saudara_kandung_ayah > 0) name = 'saudara_kandung_ayah'
    else if (saudara_tiri_seayah_ayah > 0) name = 'saudara_tiri_seayah_ayah'
    else if (anak_laki_laki_saudara_kandung_ayah > 0) name = 'anak_laki_laki_saudara_kandung_ayah'
    else if (anak_laki_laki_saudara_tiri_seayah_ayah > 0) name = 'anak_laki_laki_saudara_tiri_seayah_ayah'
    else if (pria_wanita_yang_memerdekakan_budak > 0) name = 'pria_wanita_yang_memerdekakan_budak'
    else name = 'dzawil_arhaam'

    result.unshift(new PenerimaWaris(name, 'Sisa pembagian seluruh harta', jumlahAtauSatu(body[name])))
    const idx = dataIndex([name], 'nama', result)
    result[idx].bagian_terhitung = `${sisaPenyebut}/${pembilang}`
    result[idx].updateFunds(lastFunds)

    return result
  }
}

// Pembungkus publik: menerima payload Faraidh-API, mengembalikan daftar penerima.
export function hitungFaraidLokal(ahliWaris, totalHarta) {
  return AhliWaris.solving({ ahli_waris: ahliWaris, total_harta: totalHarta })
}

export default hitungFaraidLokal
