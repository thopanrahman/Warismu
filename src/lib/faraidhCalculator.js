// ============================================================================
// MESIN KALKULATOR FARAID LOKAL & KOMPREHENSIF — WARISMU
// ============================================================================
// Mengimplementasikan pembagian faraid deterministik murni di sisi klien.
// Adaptasi algoritma open source Faraidh-API (alamrumambi) tanpa ketergantungan
// eksternal, sehingga kalkulasi dapat berjalan instan tanpa latensi server.
// ============================================================================

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

function jumlahAtauSatu(nilai) {
  const n = Number(nilai)
  return Number.isFinite(n) && n > 0 ? n : 1
}

// Solver inti Faraidh
class AhliWaris {
  constructor(data, dana) {
    this.data = data
    this.dana = dana
    this.beneficiaries = []
    this.ashabah = []
    this.kpk = 0
    this.ashabulFurud()
  }

  checkAshabulFurud() {
    this.haveHusbandOrWife()
    this.haveFather()
    this.haveMother()
    this.haveDaughterAndGrand()
    this.haveGrandFather()
    this.haveGrandMother()
    this.haveFullSister()
    this.haveConsanguineSister()
    this.haveUterineBrotherSister()
  }

  haveHusbandOrWife() {
    if (this.data.suami) {
      const bagian = (this.data.anak_laki_laki || this.data.cucu_laki_laki || this.data.anak_perempuan || this.data.cucu_perempuan) ? '1/4' : '1/2'
      this.beneficiaries.push(new PenerimaWaris('suami', bagian, 1))
    }
    if (this.data.istri) {
      const bagian = (this.data.anak_laki_laki || this.data.cucu_laki_laki || this.data.anak_perempuan || this.data.cucu_perempuan) ? '1/8' : '1/4'
      this.beneficiaries.push(new PenerimaWaris('istri', bagian, this.data.istri))
    }
  }

  haveFather() {
    if (this.data.ayah) {
      if (this.data.anak_laki_laki || this.data.cucu_laki_laki) {
        this.beneficiaries.push(new PenerimaWaris('ayah', '1/6', 1))
      } else if (this.data.anak_perempuan || this.data.cucu_perempuan) {
        this.beneficiaries.push(new PenerimaWaris('ayah', '1/6', 1))
        this.ashabah.push('ayah')
      } else {
        this.ashabah.push('ayah')
      }
    }
  }

  haveMother() {
    if (this.data.ibu) {
      const totalSaudara = (this.data.saudara_kandung || 0) + (this.data.saudara_tiri_seayah || 0) + (this.data.saudara_saudari_tiri_seibu || 0) + (this.data.saudari_kandung || 0) + (this.data.saudari_seayah || 0)
      const adaAnak = (this.data.anak_laki_laki || this.data.cucu_laki_laki || this.data.anak_perempuan || this.data.cucu_perempuan)
      if (adaAnak || totalSaudara >= 2) {
        this.beneficiaries.push(new PenerimaWaris('ibu', '1/6', 1))
      } else {
        this.beneficiaries.push(new PenerimaWaris('ibu', '1/3', 1))
      }
    }
  }

  haveDaughterAndGrand() {
    const aL = this.data.anak_laki_laki
    const aP = this.data.anak_perempuan
    const cL = this.data.cucu_laki_laki
    const cP = this.data.cucu_perempuan

    if (aP && aL) {
      this.ashabah.push('anak_perempuan', 'anak_laki_laki')
    } else if (aP && !aL) {
      if (aP === 1) this.beneficiaries.push(new PenerimaWaris('anak_perempuan', '1/2', 1))
      if (aP > 1) this.beneficiaries.push(new PenerimaWaris('anak_perempuan', '2/3', aP))
    } else if (!aP && aL) {
      this.ashabah.push('anak_laki_laki')
    }

    if (cP && cL) {
      if (!aL && aP <= 1) this.ashabah.push('cucu_perempuan', 'cucu_laki_laki')
    } else if (cP && !cL) {
      if (!aL && !aP) {
        if (cP === 1) this.beneficiaries.push(new PenerimaWaris('cucu_perempuan', '1/2', 1))
        if (cP > 1) this.beneficiaries.push(new PenerimaWaris('cucu_perempuan', '2/3', cP))
      } else if (!aL && aP === 1) {
        this.beneficiaries.push(new PenerimaWaris('cucu_perempuan', '1/6', cP))
      }
    } else if (!cP && cL) {
      if (!aL) this.ashabah.push('cucu_laki_laki')
    }
  }

  haveGrandFather() {
    if (!this.data.ayah && this.data.kakek) {
      if (this.data.anak_laki_laki || this.data.cucu_laki_laki) {
        this.beneficiaries.push(new PenerimaWaris('kakek', '1/6', 1))
      } else if (this.data.anak_perempuan || this.data.cucu_perempuan) {
        this.beneficiaries.push(new PenerimaWaris('kakek', '1/6', 1))
        this.ashabah.push('kakek')
      } else {
        this.ashabah.push('kakek')
      }
    }
  }

  haveGrandMother() {
    if (!this.data.ibu) {
      if (this.data.nenek && this.data.ibu_kakek) {
        this.beneficiaries.push(new PenerimaWaris('nenek', '1/12', 1))
        this.beneficiaries.push(new PenerimaWaris('ibu_kakek', '1/12', 1))
      } else if (this.data.nenek && !this.data.ibu_kakek) {
        this.beneficiaries.push(new PenerimaWaris('nenek', '1/6', 1))
      } else if (!this.data.nenek && this.data.ibu_kakek && !this.data.ayah) {
        this.beneficiaries.push(new PenerimaWaris('ibu_kakek', '1/6', 1))
      }
    }
  }

  haveFullSister() {
    const sP = this.data.saudari_kandung
    const sL = this.data.saudara_kandung
    const noDesc = !this.data.anak_laki_laki && !this.data.cucu_laki_laki
    const noFather = !this.data.ayah

    if (noDesc && noFather) {
      if (sP && sL) {
        this.ashabah.push('saudari_kandung', 'saudara_kandung')
      } else if (sP && !sL) {
        if (!this.data.anak_perempuan && !this.data.cucu_perempuan) {
          if (sP === 1) this.beneficiaries.push(new PenerimaWaris('saudari_kandung', '1/2', 1))
          if (sP > 1) this.beneficiaries.push(new PenerimaWaris('saudari_kandung', '2/3', sP))
        } else {
          this.ashabah.push('saudari_kandung')
        }
      } else if (!sP && sL) {
        this.ashabah.push('saudara_kandung')
      }
    }
  }

  haveConsanguineSister() {
    const sP = this.data.saudari_seayah
    const sL = this.data.saudara_tiri_seayah
    const noBlocker = !this.data.ayah && !this.data.anak_laki_laki && !this.data.cucu_laki_laki && !this.data.saudara_kandung

    if (noBlocker) {
      if (sP && sL) {
        if (!this.data.saudari_kandung || this.data.saudari_kandung <= 1) {
          this.ashabah.push('saudari_seayah', 'saudara_tiri_seayah')
        }
      } else if (sP && !sL) {
        if (!this.data.anak_perempuan && !this.data.cucu_perempuan) {
          if (!this.data.saudari_kandung) {
            if (sP === 1) this.beneficiaries.push(new PenerimaWaris('saudari_seayah', '1/2', 1))
            if (sP > 1) this.beneficiaries.push(new PenerimaWaris('saudari_seayah', '2/3', sP))
          } else if (this.data.saudari_kandung === 1) {
            this.beneficiaries.push(new PenerimaWaris('saudari_seayah', '1/6', sP))
          }
        } else if (!this.data.saudari_kandung) {
          this.ashabah.push('saudari_seayah')
        }
      } else if (!sP && sL) {
        this.ashabah.push('saudara_tiri_seayah')
      }
    }
  }

  haveUterineBrotherSister() {
    const noBlocker = !this.data.anak_laki_laki && !this.data.anak_perempuan && !this.data.cucu_laki_laki && !this.data.cucu_perempuan && !this.data.ayah && !this.data.kakek
    const uB = this.data.saudara_saudari_tiri_seibu
    if (noBlocker && uB) {
      if (uB === 1) this.beneficiaries.push(new PenerimaWaris('saudara_saudari_tiri_seibu', '1/6', 1))
      if (uB > 1) this.beneficiaries.push(new PenerimaWaris('saudara_saudari_tiri_seibu', '1/3', uB))
    }
  }

  checkOtherAshabah() {
    if (!this.ashabah.length) {
      const candidates = [
        'anak_laki_laki_saudara_kandung',
        'anak_laki_laki_saudara_tiri_seayah',
        'saudara_kandung_ayah',
        'saudara_tiri_seayah_ayah',
        'anak_laki_laki_saudara_kandung_ayah',
        'anak_laki_laki_saudara_tiri_seayah_ayah',
      ]
      const noDesc = !this.data.anak_laki_laki && !this.data.cucu_laki_laki
      const noMaleAsc = !this.data.ayah && !this.data.kakek
      const noBro = !this.data.saudara_kandung && !this.data.saudara_tiri_seayah
      if (noDesc && noMaleAsc && noBro) {
        for (const c of candidates) {
          if (this.data[c]) {
            this.ashabah.push(c)
            break
          }
        }
      }
    }
  }

  ashabulFurud() {
    this.checkAshabulFurud()
    this.checkOtherAshabah()

    if (!this.beneficiaries.length && !this.ashabah.length) {
      // Dzawil arham bila tidak ada ahli waris nasab/sabab
      this.beneficiaries.push(new PenerimaWaris('dzawil_arhaam', '1/1', 1))
      this.beneficiaries[0].updateFunds(this.dana)
      this.beneficiaries[0].updateCountPart('1/1')
      return
    }

    if (this.beneficiaries.length) {
      const penyebut = this.beneficiaries.map((b) => Number(b.bagian_hukum_waris.split('/')[1]))
      const pembilangSem = penyebut.reduce((a, b) => a * b, 1)
      this.kpk = kpk(penyebut, pembilangSem)
      let totalBagian = 0

      for (const b of this.beneficiaries) {
        const [num, den] = b.bagian_hukum_waris.split('/').map(Number)
        const count = (this.kpk / den) * num
        totalBagian += count
        b.bagian_terhitung = `${count}/${this.kpk}`
      }

      // Kasus Aul (total bagian > KPK)
      if (totalBagian > this.kpk && !this.ashabah.length) {
        const aulKpk = totalBagian
        for (const b of this.beneficiaries) {
          const count = Number(b.bagian_terhitung.split('/')[0])
          b.bagian_terhitung = `${count}/${aulKpk}`
          b.updateFunds((this.dana / aulKpk) * count)
        }
        return
      }

      // Kasus Radd (total bagian < KPK dan tidak ada ashabah)
      if (totalBagian < this.kpk && !this.ashabah.length) {
        const idxSuami = this.beneficiaries.findIndex((b) => b.nama === 'suami')
        const idxIstri = this.beneficiaries.findIndex((b) => b.nama === 'istri')
        const adaPasangan = idxSuami !== -1 || idxIstri !== -1

        if (!adaPasangan) {
          // Radd dibagi rata sesuai rasio penerima non-pasangan
          for (const b of this.beneficiaries) {
            const count = Number(b.bagian_terhitung.split('/')[0])
            b.bagian_terhitung = `${count}/${totalBagian} (setelah Radd)`
            b.updateFunds((this.dana / totalBagian) * count)
          }
          return
        }
      }

      // Normal distribution untuk ashabul furudh
      for (const b of this.beneficiaries) {
        const count = Number(b.bagian_terhitung.split('/')[0])
        b.updateFunds((this.dana / this.kpk) * count)
      }

      // Sisa untuk ashabah
      const sisaDana = Math.max(0, this.dana - this.beneficiaries.reduce((sum, b) => sum + b.dana_didapat, 0))
      const sisaBagian = Math.max(0, this.kpk - totalBagian)
      this.distribusiAshabah(sisaDana, sisaBagian, this.kpk)
    } else if (this.ashabah.length) {
      this.distribusiAshabah(this.dana, 1, 1)
    }
  }

  distribusiAshabah(sisaDana, sisaBagian, baseKpk) {
    if (!this.ashabah.length || sisaDana <= 0) return

    // Anak laki-laki & anak perempuan (2:1)
    if (this.ashabah.includes('anak_laki_laki') && this.ashabah.includes('anak_perempuan')) {
      const nL = this.data.anak_laki_laki || 0
      const nP = this.data.anak_perempuan || 0
      const totalPorsi = (nL * 2) + nP
      if (totalPorsi > 0) {
        const danaPerPorsi = sisaDana / totalPorsi
        const pL = new PenerimaWaris('anak_laki_laki', '2 kali lipat anak perempuan', nL)
        pL.updateFunds(danaPerPorsi * 2 * nL)
        pL.updateCountPart(`${(nL * 2)}/${totalPorsi} dari sisa ${sisaBagian}/${baseKpk}`)
        this.beneficiaries.push(pL)

        const pP = new PenerimaWaris('anak_perempuan', '1/2 bagian anak laki-laki', nP)
        pP.updateFunds(danaPerPorsi * nP)
        pP.updateCountPart(`${nP}/${totalPorsi} dari sisa ${sisaBagian}/${baseKpk}`)
        this.beneficiaries.push(pP)
      }
      return
    }

    // Cucu laki-laki & cucu perempuan (2:1)
    if (this.ashabah.includes('cucu_laki_laki') && this.ashabah.includes('cucu_perempuan')) {
      const nL = this.data.cucu_laki_laki || 0
      const nP = this.data.cucu_perempuan || 0
      const totalPorsi = (nL * 2) + nP
      if (totalPorsi > 0) {
        const danaPerPorsi = sisaDana / totalPorsi
        const pL = new PenerimaWaris('cucu_laki_laki', '2 kali lipat cucu perempuan', nL)
        pL.updateFunds(danaPerPorsi * 2 * nL)
        pL.updateCountPart(`${(nL * 2)}/${totalPorsi} dari sisa ${sisaBagian}/${baseKpk}`)
        this.beneficiaries.push(pL)

        const pP = new PenerimaWaris('cucu_perempuan', '1/2 bagian cucu laki-laki', nP)
        pP.updateFunds(danaPerPorsi * nP)
        pP.updateCountPart(`${nP}/${totalPorsi} dari sisa ${sisaBagian}/${baseKpk}`)
        this.beneficiaries.push(pP)
      }
      return
    }

    // Saudara & saudari kandung (2:1)
    if (this.ashabah.includes('saudara_kandung') && this.ashabah.includes('saudari_kandung')) {
      const nL = this.data.saudara_kandung || 0
      const nP = this.data.saudari_kandung || 0
      const totalPorsi = (nL * 2) + nP
      if (totalPorsi > 0) {
        const danaPerPorsi = sisaDana / totalPorsi
        const pL = new PenerimaWaris('saudara_kandung', '2 kali lipat saudari kandung', nL)
        pL.updateFunds(danaPerPorsi * 2 * nL)
        pL.updateCountPart(`${(nL * 2)}/${totalPorsi} dari sisa ${sisaBagian}/${baseKpk}`)
        this.beneficiaries.push(pL)

        const pP = new PenerimaWaris('saudari_kandung', '1/2 bagian saudara kandung', nP)
        pP.updateFunds(danaPerPorsi * nP)
        pP.updateCountPart(`${nP}/${totalPorsi} dari sisa ${sisaBagian}/${baseKpk}`)
        this.beneficiaries.push(pP)
      }
      return
    }

    // Tunggal ashabah
    for (const nama of this.ashabah) {
      const orang = jumlahAtauSatu(this.data[nama])
      const p = new PenerimaWaris(nama, 'Sisa (Ashabah)', orang)
      p.updateFunds(sisaDana)
      p.updateCountPart(`Sisa ${sisaBagian}/${baseKpk}`)
      this.beneficiaries.push(p)
      break // ashabah prioritas pertama mengambil seluruh sisa
    }
  }
}

// Metadata informasi & dalil syariat per ahli waris
export const INFO_AHLI_WARIS = {
  suami: {
    label: 'Suami',
    kategori: 'Pasangan',
    dalil: 'QS. An-Nisa: 12',
    khi: 'KHI Pasal 179',
    penjelasanAdaAnak: 'Mendapat 1/4 bagian karena pewaris meninggalkan anak/cucu.',
    penjelasanTanpaAnak: 'Mendapat 1/2 bagian karena pewaris tidak meninggalkan keturunan.',
  },
  istri: {
    label: 'Istri',
    kategori: 'Pasangan',
    dalil: 'QS. An-Nisa: 12',
    khi: 'KHI Pasal 180',
    penjelasanAdaAnak: 'Mendapat 1/8 bagian (dibagi bersama bila lebih dari 1 istri) karena ada anak/cucu.',
    penjelasanTanpaAnak: 'Mendapat 1/4 bagian karena pewaris tidak meninggalkan keturunan.',
  },
  anak_laki_laki: {
    label: 'Anak Laki-Laki',
    kategori: 'Keturunan Utama',
    dalil: 'QS. An-Nisa: 11',
    khi: 'KHI Pasal 176',
    penjelasan: 'Mendapat bagian sisa (Ashabah). Bagian 1 anak laki-laki setara dengan 2 bagian anak perempuan.',
  },
  anak_perempuan: {
    label: 'Anak Perempuan',
    kategori: 'Keturunan Utama',
    dalil: 'QS. An-Nisa: 11',
    khi: 'KHI Pasal 176',
    penjelasan: 'Mendapat 1/2 jika tunggal, 2/3 jika 2 orang atau lebih, atau menjadi ashabah bersama anak laki-laki.',
  },
  ayah: {
    label: 'Ayah Kandung',
    kategori: 'Orang Tua',
    dalil: 'QS. An-Nisa: 11',
    khi: 'KHI Pasal 177',
    penjelasan: 'Mendapat 1/6 pasti bila ada anak laki-laki, 1/6 + sisa bila hanya ada anak perempuan, atau seluruh sisa bila tanpa anak.',
  },
  ibu: {
    label: 'Ibu Kandung',
    kategori: 'Orang Tua',
    dalil: 'QS. An-Nisa: 11',
    khi: 'KHI Pasal 178',
    penjelasan: 'Mendapat 1/6 bila ada anak/cucu atau 2 saudara atau lebih. Mendapat 1/3 bila tidak ada anak dan saudara.',
  },
  cucu_laki_laki: {
    label: 'Cucu Laki-Laki (dari anak laki-laki)',
    kategori: 'Keturunan Sekunder',
    dalil: 'Ijma Ulama & KHI',
    khi: 'KHI Pasal 185',
    penjelasan: 'Mewarisi bagian sisa jika tidak terhalang (mahjub) oleh adanya anak laki-laki kandung.',
  },
  cucu_perempuan: {
    label: 'Cucu Perempuan (dari anak laki-laki)',
    kategori: 'Keturunan Sekunder',
    dalil: 'Ijma Ulama & KHI',
    khi: 'KHI Pasal 185',
    penjelasan: 'Mewarisi 1/6 sebagai pelengkap 2/3 jika ada 1 anak perempuan, atau ashabah bersama cucu laki-laki.',
  },
  kakek: {
    label: 'Kakek (dari pihak ayah)',
    kategori: 'Leluhur',
    dalil: 'Kompilasi Hukum Islam',
    khi: 'KHI Pasal 177',
    penjelasan: 'Menggantikan posisi ayah jika ayah telah wafat terlebih dahulu.',
  },
  nenek: {
    label: 'Nenek (pihak ibu)',
    kategori: 'Leluhur',
    dalil: 'Hadis Riwayat Abu Dawud',
    khi: 'KHI Pasal 178',
    penjelasan: 'Mendapatkan 1/6 jika ibu telah wafat.',
  },
  ibu_kakek: {
    label: 'Nenek (pihak ayah)',
    kategori: 'Leluhur',
    dalil: 'Hadis Riwayat Ibnu Majah',
    khi: 'KHI Pasal 178',
    penjelasan: 'Mendapatkan bagian jika ibu dan ayah telah tiada.',
  },
  saudara_kandung: {
    label: 'Saudara Laki-Laki Kandung',
    kategori: 'Saudara',
    dalil: 'QS. An-Nisa: 176',
    khi: 'KHI Pasal 181-182',
    penjelasan: 'Ashabah bila pewaris tidak memiliki keturunan laki-laki maupun ayah.',
  },
  saudari_kandung: {
    label: 'Saudari Perempuan Kandung',
    kategori: 'Saudara',
    dalil: 'QS. An-Nisa: 176',
    khi: 'KHI Pasal 182',
    penjelasan: 'Mendapat 1/2 jika tunggal, 2/3 jika jamak, atau ashabah bila bersama saudara laki-laki.',
  },
  saudara_tiri_seayah: {
    label: 'Saudara Laki-Laki Seayah',
    kategori: 'Saudara',
    dalil: 'QS. An-Nisa: 176',
    khi: 'KHI Pasal 181',
    penjelasan: 'Mewarisi sisa jika tidak ada saudara kandung laki-laki.',
  },
  saudari_seayah: {
    label: 'Saudari Perempuan Seayah',
    kategori: 'Saudara',
    dalil: 'QS. An-Nisa: 176',
    khi: 'KHI Pasal 182',
    penjelasan: 'Mendapat 1/6 pelengkap 2/3 jika ada 1 saudari kandung, atau 1/2 jika tidak ada saudari kandung.',
  },
  saudara_saudari_tiri_seibu: {
    label: 'Saudara/i Seibu',
    kategori: 'Saudara',
    dalil: 'QS. An-Nisa: 12',
    khi: 'KHI Pasal 181',
    penjelasan: 'Mendapat 1/6 jika 1 orang, atau 1/3 dibagi rata laki-laki dan perempuan jika lebih dari 1 orang.',
  },
  dzawil_arhaam: {
    label: 'Dzawil Arham',
    kategori: 'Kerabat Khusus',
    dalil: 'Kaidah Faraid KHI',
    khi: 'KHI Buku II',
    penjelasan: 'Kerabat yang tidak termasuk ashabul furudh maupun ashabah, mewarisi bila tidak ada ahli waris utama.',
  },
}

// Formatter Rupiah
export function formatRupiah(nilai) {
  const n = Math.round(Number(nilai) || 0)
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(n)
}

// Parser input nominal angka bersih
export function bersihkanAngka(teks) {
  if (typeof teks === 'number') return Math.max(0, teks)
  const bersih = String(teks || '').replace(/[^\d]/g, '')
  return Math.max(0, parseInt(bersih, 10) || 0)
}

// Fungsi Utama: Hitung Faraid Komprehensif
export function hitungFaraidKomprehensif({
  genderPewaris = 'laki_laki',
  totalHartaKotor = 0,
  hutangPewaris = 0,
  biayaJenazah = 0,
  wasiatPewaris = 0,
  ahliWaris = {},
}) {
  const hartaKotor = Math.max(0, bersihkanAngka(totalHartaKotor))
  const hutang = Math.max(0, bersihkanAngka(hutangPewaris))
  const biayaPengurusan = Math.max(0, bersihkanAngka(biayaJenazah))

  // Dalam syariat: Harta Kotor dikurangi Hutang dan Biaya Jenazah dahulu
  const sisaSebelumWasiat = Math.max(0, hartaKotor - hutang - biayaPengurusan)

  // Batas maksimal wasiat syariat adalah 1/3 dari harta bersih sebelum wasiat
  const batasMaksWasiat = sisaSebelumWasiat / 3
  const inputWasiat = Math.max(0, bersihkanAngka(wasiatPewaris))
  const wasiatDijalankan = Math.min(inputWasiat, batasMaksWasiat)
  const wasiatDipotong = inputWasiat > batasMaksWasiat

  // Harta Bersih Warisan (Tirkah) yang siap dibagi
  const hartaBersih = Math.max(0, sisaSebelumWasiat - wasiatDijalankan)

  // Normalisasi data ahli waris
  const dataAhliWaris = {
    anak_laki_laki: bersihkanAngka(ahliWaris.anak_laki_laki),
    cucu_laki_laki: bersihkanAngka(ahliWaris.cucu_laki_laki),
    anak_perempuan: bersihkanAngka(ahliWaris.anak_perempuan),
    cucu_perempuan: bersihkanAngka(ahliWaris.cucu_perempuan),
    ayah: bersihkanAngka(ahliWaris.ayah),
    kakek: bersihkanAngka(ahliWaris.kakek),
    saudara_saudari_tiri_seibu: bersihkanAngka(ahliWaris.saudara_saudari_tiri_seibu),
    saudara_kandung: bersihkanAngka(ahliWaris.saudara_kandung),
    saudara_tiri_seayah: bersihkanAngka(ahliWaris.saudara_tiri_seayah),
    anak_laki_laki_saudara_kandung: bersihkanAngka(ahliWaris.anak_laki_laki_saudara_kandung),
    anak_laki_laki_saudara_tiri_seayah: bersihkanAngka(ahliWaris.anak_laki_laki_saudara_tiri_seayah),
    saudara_kandung_ayah: bersihkanAngka(ahliWaris.saudara_kandung_ayah),
    saudara_tiri_seayah_ayah: bersihkanAngka(ahliWaris.saudara_tiri_seayah_ayah),
    anak_laki_laki_saudara_kandung_ayah: bersihkanAngka(ahliWaris.anak_laki_laki_saudara_kandung_ayah),
    anak_laki_laki_saudara_tiri_seayah_ayah: bersihkanAngka(ahliWaris.anak_laki_laki_saudara_tiri_seayah_ayah),
    saudari_kandung: bersihkanAngka(ahliWaris.saudari_kandung),
    saudari_seayah: bersihkanAngka(ahliWaris.saudari_seayah),
    ibu: bersihkanAngka(ahliWaris.ibu),
    nenek: bersihkanAngka(ahliWaris.nenek),
    ibu_kakek: bersihkanAngka(ahliWaris.ibu_kakek),
    suami: genderPewaris === 'perempuan' ? bersihkanAngka(ahliWaris.suami) : 0,
    istri: genderPewaris === 'laki_laki' ? bersihkanAngka(ahliWaris.istri) : 0,
  }

  // Jalankan solver
  let solverHasil = []
  try {
    const solver = new AhliWaris(dataAhliWaris, hartaBersih)
    solverHasil = solver.beneficiaries || []
  } catch (err) {
    console.error('[FaraidhCalculator Error]:', err)
  }

  // Palet warna yang harmonis untuk chart/bar visualisasi proporsi waris
  const paletWarna = [
    '#1d3e32', // forest-900
    '#2f614e', // forest-700
    '#4f9578', // forest-500
    '#72b095', // forest-400
    '#3c7a61', // forest-600
    '#596e57', // sage-600
    '#728b6f', // sage-500
    '#8ea68b', // sage-400
    '#b47a18', // dalil amber
    '#213a2d', // ink-800
  ]

  let totalDanaTerdistribusi = 0
  const daftarPenerima = solverHasil.map((item, idx) => {
    totalDanaTerdistribusi += item.dana_didapat
    const meta = INFO_AHLI_WARIS[item.nama] || {
      label: item.nama.replace(/_/g, ' '),
      kategori: 'Ahli Waris',
      dalil: 'QS. An-Nisa',
      khi: 'KHI Buku II',
      penjelasan: 'Mendapat bagian sesuai ketentuan hukum faraid.',
    }

    const porsiPersen = hartaBersih > 0 ? ((item.dana_didapat / hartaBersih) * 100) : 0

    return {
      id: item.nama,
      label: meta.label,
      kategori: meta.kategori,
      jumlahOrang: item.jumlah_orang || 1,
      bagianHukum: item.bagian_hukum_waris,
      bagianTerhitung: item.bagian_terhitung,
      danaTotal: item.dana_didapat,
      danaPerOrang: item.dana_per_orang,
      porsiPersen: Number(porsiPersen.toFixed(2)),
      warna: paletWarna[idx % paletWarna.length],
      dalil: meta.dalil,
      khi: meta.khi,
      penjelasan: meta.penjelasan || meta.penjelasanAdaAnak || 'Ketentuan pembagian menurut syariat faraid.',
    }
  })

  const sisaTidakTerbagi = Math.max(0, hartaBersih - totalDanaTerdistribusi)

  return {
    ringkasanHarta: {
      hartaKotor,
      hutang,
      biayaPengurusan,
      wasiatInput: inputWasiat,
      wasiatDijalankan,
      wasiatDipotong,
      batasMaksWasiat,
      totalPengurang: hutang + biayaPengurusan + wasiatDijalankan,
      hartaBersih,
      totalDanaTerdistribusi,
      sisaTidakTerbagi,
    },
    daftarPenerima,
    totalPenerima: daftarPenerima.reduce((sum, p) => sum + p.jumlahOrang, 0),
    adaPenerima: daftarPenerima.length > 0,
  }
}

// Skenario Preset / Contoh Kasus Nyata
export const CONTOH_SKENARIO = [
  {
    judul: 'Keluarga Inti (Istri, Anak & Ibu)',
    deskripsi: 'Suami wafat meninggalkan istri, 2 anak laki-laki, 1 anak perempuan, dan seorang ibu.',
    gender: 'laki_laki',
    harta: 240000000,
    hutang: 10000000,
    biaya: 5000000,
    wasiat: 15000000,
    ahliWaris: {
      istri: 1,
      anak_laki_laki: 2,
      anak_perempuan: 1,
      ibu: 1,
      ayah: 0,
    },
  },
  {
    judul: 'Istri Wafat (Suami & 1 Anak Perempuan)',
    deskripsi: 'Istri wafat meninggalkan suami, 1 anak perempuan tunggal, dan ayah kandung.',
    gender: 'perempuan',
    harta: 120000000,
    hutang: 0,
    biaya: 4000000,
    wasiat: 0,
    ahliWaris: {
      suami: 1,
      anak_perempuan: 1,
      ayah: 1,
      ibu: 0,
    },
  },
  {
    judul: 'Pewaris Tanpa Anak (Kalalah)',
    deskripsi: 'Suami wafat tanpa anak, meninggalkan istri, ibu, dan 2 saudara laki-laki kandung.',
    gender: 'laki_laki',
    harta: 180000000,
    hutang: 0,
    biaya: 5000000,
    wasiat: 0,
    ahliWaris: {
      istri: 1,
      ibu: 1,
      saudara_kandung: 2,
    },
  },
]
