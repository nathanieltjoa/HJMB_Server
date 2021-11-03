const {  gql } = require('apollo-server-express');

//namaPelapor itu dipake untuk nge show nama karyawan entah kalau anggota mau liat laporannya
//maka nama ketua yg terisii kalau ketua mau lihat maka nama pembuat laporan yang muncul
module.exports = gql`
  scalar MyDate
    type User{
        id: Int
        username: String!
        createdAt: String
        idJabatan: Int
        token: String
        jabatan: String
        passwordRaw: String
        isChief: Boolean
        userDivisi: String
    }
    type Jabatan{
      id: Int
      namaJabatan: String
      jabatanKu: String 
      tingkatJabatan: Int
    }
    type Karyawan{
      id: Int
      nama: String
      nik: String
      noTelp: String 
      tanggalMasuk: MyDate
      tempatLahir: String
      tanggalLahir: MyDate
      alamat: String
      agama: String
      pendidikan: String
      namaJabatan: String
      foto: String
      JabatanId: Int 
      jabatan: Jabatan
      hPenilaianHRD: [HPenilaianHRD]
      hPenilaianKuisioner: [HPenilaianKuisioner]
      pembagianAnggotaKaryawan: PembagianAnggota
      username: String
      passwordRaw: String
    }
    type Izin{
      id: Int 
      namaIzin: String 
      totalIzin: Int 
      keterangan: String 
      status: Boolean
      batasanHari: Boolean
      totalPemakaian: Int  
    }
    type Permintaan{
      id: String
      idPeminta: Int
      jenis: String
      tanggalMulai: MyDate
      tanggalBerakhir: MyDate
      totalHari: Int 
      keterangan: String
      upload: String
      status: Int
      idKetua: Int
      idHRD: Int
      alasan: String
      namaPeminta: String
      namaJabatan: String
      ketua: Karyawan 
      hrd: Karyawan
      peminta: Karyawan 
      izin: Izin
    }
    type PermintaanSurat{
      id: String 
      jenisSurat: String 
      idHRD: Int 
      idKaryawan: Int 
      tanggalKerja: MyDate 
      file: String 
      keterangan: String 
      keteranganHRD: String 
      status: Int  
      createdAt: MyDate
      karyawan: Karyawan 
      hrd: Karyawan
    }
    type PermintaanSuratPerintah{
      id: String 
      idHRD: Int 
      idKaryawan: Int 
      dinas: String 
      keterangan: String 
      tanggalMulai: MyDate
      tanggalAkhir: MyDate
      status: Int  
      keteranganKaryawan: String 
      file: String 
      createdAt: MyDate
      karyawan: Karyawan 
      hrd: Karyawan
    }
    type TargetKerja{
      id: Int
      jumlahTarget: Int 
      satuanTarget: String 
      namaPengerjaan: String
      updatedBy: Int 
    }
    type Divisi{
      id: Int 
      namaDivisi: String 
      status: Int 
      jumlahGroup: Int 
    }
    type TipeMesin{
      id: Int 
      DivisiId: Int  
      namaTipe: String
      status: Boolean 
    }
    type Absensi{
      id: String 
      idKaryawan: Int 
      tanggal: MyDate 
      JamKerjaId: Int 
      scanMasuk: String 
      scanPulang: String 
      terlambat: String 
      jamBolos: String 
      absen: Boolean
      lembur: String 
      namaKaryawan: String 
      jamKerja: JamKerja
    }
    type JamKerja{
      id: Int 
      namaShift: String 
      jamMasuk: String 
      jamKeluar: String 
      batasMasuk: String 
      batasKeluar: String 
    }
    type ListKuisioner{
      id: Int 
      divisi: String 
      namaKuisioner: String 
      deskripsiKuisioner: String 
      jenisKuisioner: String 
      status: Boolean
      listDistribusi: [ListDistribusiKuisioner]
    }
    type ListDistribusiKuisioner{
      id: Int 
      ListKuisionerId: Int 
      TingkatJabatan: Int 
      namaJabatan: String
      persentaseNilai: Int 
      status: Boolean
    }
    type ListPertanyaan{
      id: Int 
      ListKuisionerId: Int 
      teskPertanyaan: String 
      jenisPertanyaan: String 
      status: Boolean
      listJawaban: [ListJawaban]
      listTanggapan: [ListTanggapan]
    }
    type ListJawaban{
      id: Int 
      ListPertanyaanId: Int 
      teskJawaban: String 
      benar: Boolean
      status: Boolean
    }
    type ListTanggapan{
      id: String 
      ListPertanyaanId: Int 
      idKaryawan: Int 
      teskTanggapan: String 
      ListJawabanId: Int 
      status: Boolean
    }
    type IndexGaji{
      id: Int 
      namaGaji: String 
      keteranganGaji: String 
      status: Boolean
    }
    type IndexIuran{
      id: Int 
      namaIuran: String 
      keteranganIuran: String 
      status: Boolean
    }
    type HKontrakKaryawan{
      id: String 
      idKaryawan: Int 
      idHRD: Int 
      jenisKontrak: String 
      totalGaji: Int 
      totalIuran: Int 
      tanggalMulai: MyDate
      tanggalBerakhir: MyDate
      status: Int 
      karyawan: Karyawan
      dKontrakGaji: [DKontrakGaji]
      dKontrakIuran: [DKontrakIuran]
    }
    type DKontrakGaji{
      id: String 
      HKontrakKaryawanId: String 
      IndexGajiId: Int 
      total: Int 
      dKontrakIndexGaji: IndexGaji
    }
    type DKontrakIuran{
      id: String 
      HKontrakKaryawanId: String 
      IndexIuranId: Int 
      total: Int 
      dKontrakIndexIuran: IndexIuran
    }
    type IndexPenilaian{
      id: Int 
      namaIndex: String 
      nilaiIndex: Int 
      keteranganIndex: String 
      status: Boolean
    }
    type HPenilaianHRD{
      id: String 
      idKaryawan: Int 
      totalNilai: Float
      jumlahNilai: Float 
      jumlahKaryawan: Int  
    }
    type DPenilaianHRD{
      id: String 
      HPenilaianHRDId: String 
      IndexPenilaianId: Int 
      idPenilai: Int 
      nilai: Int 
    }
    type HPenilaianKuisioner{
      id: String 
      idKaryawan: Int 
      totalNilai: Float 
      jumlahNilai: Float 
      jumlahKaryawan: Int 
    }
    type DPenilaianKuisioner{
      id: String 
      HPenilaianKuisionerId: String 
      ListKuisionerId: Int 
      idPenilai: Int 
      nilai: Float 
    }
    type PenilaianHRD{
      id: String 
      idPelapor: Int 
      idKaryawan: Int 
      nilaiKaryawan: Int 
      IndexPenilaianId: Int 
    }
    type PengaruhNilai{
      id: Int 
      nilaiMin: Float 
      nilaiMax: Float 
      hasilNilai: String 
      pengurangan: Boolean 
      nilaiUang: Int 
    }
    type HPinjamUang{
      id: String 
      idKaryawan: Int 
      idKeuangan: Int 
      idHRD: Int 
      jumlahPinjam: Int 
      keteranganPinjam: String 
      lunas: Boolean
      cicilan: Int 
      status: Int
      keteranganHRD: String 
      dPinjamUang: [DPinjamUang]
      karyawan: Karyawan
      keuangan: Karyawan
      hrd: Karyawan
    }
    type DPinjamUang{
      id: String 
      HPinjamUangId: String 
      totalPembayaran: Int 
      pembayaranKe: Int 
      lunas: Boolean
    }
    type LaporanDataDiri{
      id: Int  
      idKaryawan: Int 
      bagianData: String 
      dataSeharusnya: String 
      idHRD: Int 
      status: Boolean
      namaKaryawan: String 
      createdAt: MyDate
    }
    type PembagianAnggota{
      id: Int 
      idKaryawan: Int 
      JabatanId: Int 
      groupKaryawan: Int 
      ketua: Boolean
      karyawan: Karyawan
      jabatan: Jabatan
    }
    type HPembayaranGaji{
      id: String 
      HKontrakKaryawanId: String 
      verifikasiKaryawan: Boolean 
      idKeuangan: Int 
      idHRD: Int 
      totalGaji: Int 
      tanggalPembayaran: MyDate
      status: Int 
      createdAt: MyDate
      karyawan: Karyawan 
      hrd: Karyawan 
      keuangan: Karyawan
      kontrak: HKontrakKaryawan
    }
    type DPembayaranGaji{
      id: String 
      HPembayaranGajiId: String 
      pengurangan: Boolean 
      nama: String 
      total: Int 
      keterangan: String 
    }
    type PermintaanPromosiJabatan{
      id: Int 
      idPenerima: Int 
      idPelapor: Int 
      idKaryawan: Int 
      kenaikan: Boolean 
      keterangan: String 
      keteranganDirektur: String 
      status: Int 
      createdAt: MyDate
      penerima: Karyawan
      pelapor: Karyawan
      karyawan: Karyawan
    }
    type LaporanMixerPipa{
      id: String 
      tipeMesin: String 
      bahanDigunakan: Int 
      totalHasil: Int 
      targetMixer: Int
      foto: String
      keterangan: String
      idPelapor: Int 
      idKetua: Int 
      status: Int 
      pernahBanding: Boolean
      keteranganBanding: String
      createdAt: MyDate
      namaPelapor: String
      karyawan: Karyawan
      ketua: Karyawan
    }
    type HLaporanProduksiPipa{
      id: String 
      shift: String 
      tipeMesin: String 
      warna: String
      ukuran: Int
      idPelapor: Int 
      idKetua: Int 
      dis: Int 
      pin: Int 
      hasilProduksi: Int 
      jumlahBahan: Int 
      BS: Int 
      totalBahan: Int 
      status: Int 
      namaPelapor: String 
      karyawan: Karyawan 
      ketua: Karyawan
      createdAt: MyDate
      count: Int 
      dLaporan: [DLaporanProduksiPipa]
    }
    type DLaporanProduksiPipa{
      id: String 
      idHLaporan: String 
      totalProduksi: Int 
      targetProduksi: Int 
      foto: String 
      status: Int 
      pernahBanding: Boolean
      keteranganBanding: String 
      jamLaporan: String
      keterangan: String 
      createdAt: MyDate
      hLaporan: HLaporanProduksiPipa
      uLaporan: [ULaporanProduksiPipa]
      namaPelapor: String 
      shift: String 
      tipeMesin: String 
    }
    type ULaporanProduksiPipa{
      id: String 
      DLaporanProduksiPipaId: String
      namaUraian: String  
      nilaiUraian: Int 
    }
    type HLaporanQualityControlPipa{
      id: String 
      shift: String 
      tipeMesin: String 
      idPelapor: Int 
      idKetua: Int 
      merk: String 
      panjang: Float 
      ketebalan: Float 
      diameterLuar: Float 
      diameterDalam: Float 
      totalReject: Int 
      totalProduksi: Int 
      status: Int 
      namaPelapor: String 
      createdAt: MyDate
      jumlahBanding: Int 
      karyawan: Karyawan
      ketua: Karyawan
      dLaporanQC: [DLaporanQualityControlPipa]
    }
    type DLaporanQualityControlPipa{
      id: String 
      HLaporanQualityControlPipaId: String 
      jamLaporan: String
      diameter: Float 
      panjang: Float 
      berat: Float 
      keterangan: String 
      status: Int 
      pernahBanding: Boolean
      keteranganBanding: String 
      foto: String 
      namaPelapor: String 
      createdAt: MyDate
      shift: String 
      tipeMesin: String 
    }
    type HLaporanStokistPipa{
      id: String 
      idPelapor: Int 
      idKetua: Int 
      shift: String 
      foto: String 
      keterangan: String 
      status: Int 
      pernahBanding: Boolean
      keteranganBanding: String 
      createdAt: MyDate
      namaPelapor: String 
      jumlahBaik: Int 
      jumlahBS: Int 
      karyawan: Karyawan
      ketua: Karyawan
      dLaporanStokistPipa: [DLaporanStokistPipa]
    }
    type DLaporanStokistPipa{
      id: String 
      HLaporanStokistPipaId: String 
      LaporanStokId: Int
      jumlahPipa: Int 
      diHapus: Boolean
      panjangPipa: Float 
      beratPipa: Float 
      totalBaik: Int 
      totalBS: Int 
      laporanStokStokistPipa: LaporanStok
    }
    type HLaporanKetuaStokistPipa{
      id: String 
      idPelapor: Int 
      shift: String 
      mesin: String 
      totalBaik: Int 
      totalBS: Int 
      createdAt: MyDate
      namaPelapor: String 
      dLaporanKetuaSP: [DLaporanKetuaStokistPipa]
    }
    type DLaporanKetuaStokistPipa{
      id: String 
      HLaporanKetuaStokistPipaId: String 
      merkPipa: String 
      jenisPipa: String 
      ukuranPipa: String 
      warnaPipa: String 
      panjangPipa: Float 
      beratPipa: Float 
      totalBaik: Int 
      totalBS: Int 
      keterangan: String
    }
    type HLaporanArmada{
      id: String 
      idNota: String 
      idArmada: Int 
      idStokist: Int 
      idSupir: Int 
      idKernet: Int 
      keterangan: String 
      penerima: String
      foto: String  
      status: Int
      pengantaran: MyDate
      kembali: MyDate
      createdAt: MyDate
      namaPelapor: String 
      namaSupir: String 
      namaKernet: String 
      armada: Karyawan 
      stokist: Karyawan 
      supir: Karyawan 
      kernet: Karyawan
    }
    type DLaporanArmada{
      id: String 
      HLaporanArmadaId: String 
      merkBarang: String 
      tipeBarang: String 
      ukuranBarang: String 
      jumlahBarang: Int 
      satuanBarang: String 
      diHapus: Boolean
    }
    type LaporanStok{
      id: Int  
      jenisBarang: String
      merkBarang: String 
      tipeBarang: String 
      ukuranBarang: String 
      satuanBarang: String 
      jumlahBarang: Int 
      status: Boolean 
    }
    type LaporanKeluarMasukPipa{
      id: String 
      LaporanStokId: Int 
      terimaLaporan: String 
      jenisLaporan: String 
      jumlahLaporan: Int 
      laporanStokKeluarMasukPipa: LaporanStok
    }
    type HLaporanCatTegel{
      id: String 
      idPelapor: Int 
      jenisProduk: String 
      createdAt: MyDate
      namaPelapor: String 
      karyawan: Karyawan
      dLaporanCatTegel: [DLaporanCatTegel]
    }
    type DLaporanCatTegel{
      id: String
      HLaporanCatTegelId: String 
      merkProduk: String 
      warna: String 
      jumlahProduk: Int 
      satuanProduk: String
      foto: String  
      keterangan: String 
      khusus: Boolean
      namaPelapor: String 
      jenisProduk: String 
      createdAt: MyDate
      hLaporanCatTegel: HLaporanCatTegel
    }
    type ULaporanCatTegel{
      id: String 
      DLaporanCatTegelId: String 
      namaBahan: String 
      jumlahBahan: Int 
      satuanBahan: String
      diHapus: Boolean
    }
    type HLaporanSpandek{
      id: String 
      idPelapor: Int 
      idKetua: Int 
      jenisProduk: String 
      totalPanjang: Float 
      totalBS: Float
      totalBerat: Float 
      createdAt: MyDate
      namaPelapor: String 
      karyawan: Karyawan
      ketua: Karyawan
      dLaporanSpandek: [DLaporanSpandek]
    }
    type DLaporanSpandek{
      id: String 
      HLaporanSpandekId: String 
      namaPemesan: String 
      warna: String 
      ukuran: Float
      berat: Float
      panjang: Float 
      BS: Float 
      noCoil: String 
      keterangan: String 
      foto: String 
      status: Int
      pernahBanding: Boolean
      keteranganBanding: String
      createdAt: MyDate
      namaPelapor: String 
      jenisProduk: String 
      hLaporanSpandek: HLaporanSpandek
    }
    type HLaporanHollow{
      id: String 
      idPelapor: Int 
      idKetua: Int 
      totalBerat: Float
      totalJumlah: Int 
      totalBS: Int 
      createdAt: MyDate
      namaPelapor: String
      karyawan: Karyawan
      ketua: Karyawan
      dLaporanHollow: [DLaporanHollow]
    }
    type DLaporanHollow{
      id: String 
      HLaporanHollowId: String 
      ukuran: String 
      ketebalan: Float 
      berat: Float
      noCoil: String 
      jumlah: Int 
      BS: Int 
      keterangan: String 
      foto: String 
      status: Int 
      pernahBanding: Boolean
      keteranganBanding: String 
      createdAt: MyDate
      namaPelapor: String
      hLaporanHollow: HLaporanHollow 
    }
    type Gudang{
      id: Int 
      namaGudang: String 
      alamatGudang: String 
      status: Int
    }
    type HLaporanSekuriti{
      id: String 
      GudangId: Int 
      tanggalLaporan: MyDate
      shift: String 
      idKetua: Int 
      idPenyerah: Int 
      idPenerima: Int
      createdAt: MyDate
      namaKetua: String 
      namaPenyerah: String 
      namaPenerima: String 
      namaGudang: String
      gudang: Gudang
      penyerah: Karyawan
      penerima: Karyawan
      ketua: Karyawan
      dLaporanDinasSekuriti: [DLaporanDinasSekuriti]
      dLaporanInventarisSekuriti: [DLaporanInventarisSekuriti]
      dLaporanMutasiSekuriti: [DLaporanMutasiSekuriti]
    }
    type DLaporanDinasSekuriti{
      id: String 
      HLaporanSekuritiId: String 
      idPelapor: Int 
      jamMasuk: String
      jamKeluar: String
      noHT: String 
      keterangan: String 
      namaPelapor: String
    }
    type DLaporanInventarisSekuriti{
      id: String 
      HLaporanSekuritiId: String 
      idPelapor: Int 
      namaBarang: String 
      jumlahBarang: Int 
      baik: Boolean
      keterangan: String 
      namaPelapor: String
    }
    type DLaporanMutasiSekuriti{
      id: String 
      HLaporanSekuritiId: String 
      idPelapor: Int 
      jamLaporan: String
      uraian: String 
      foto: String
      keterangan: String
      namaPelapor: String 
    }
    type HLaporanSales{
      id: String 
      idPelapor: Int 
      idKetua: Int 
      status: Int 
      laporanKejadian: Boolean
      keteranganKejadian: String 
      feedbackKaryawan: String 
      createdAt: MyDate
      namaPelapor: String 
      karyawan: Karyawan
      ketua: Karyawan
      dLaporanSales: [DLaporanSales]
    }
    type DLaporanSales{
      id: String 
      HLaporanSalesId: String 
      namaToko: String 
      foto: String 
      keterangan: String 
      jamMasuk: String 
      jamKeluar: String 
      createdAt: MyDate
      status: Int 
      namaPelapor: String
    }
    type pageHLaporanProduksiPipa{
      count: Int 
      rows: [HLaporanProduksiPipa]
    }
    type pageHLaporanQualityControl{
      count: Int 
      rows: [HLaporanQualityControlPipa]
    }
    type pageHLaporanSpandek{
      count: Int 
      rows: [HLaporanSpandek]
    }
    type pageHLaporanHollow{
      count: Int 
      rows: [HLaporanHollow]
    }
    type pageHLaporanSekuriti{
      count: Int 
      rows: [HLaporanSekuriti]
    }
    type pageHLaporanSales{
      count: Int 
      rows: [HLaporanSales]
    }
    type pageHLaporanMixerPipa{
      count: Int 
      rows: [LaporanMixerPipa]
    }
    type pageHLaporanKetuaStokistPipa{
      count: Int 
      rows: [HLaporanKetuaStokistPipa]
    }
    type pageHLaporanAramada{
      count: Int 
      rows: [HLaporanArmada]
    }
    type pageHLaporanStokistPipa{
      count: Int 
      rows: [HLaporanStokistPipa]
    }
    type pageLaporanKeluarMasukPipa{
      count: Int 
      rows: [LaporanKeluarMasukPipa]
    }
    type pageDLaporanCatTegel{
      count: Int 
      rows: [DLaporanCatTegel]
    }
    type pageDLaporanHollow{
      count: Int 
      rows: [DLaporanHollow]
    }
    type pageDLaporanSpandek{
      count: Int 
      rows: [DLaporanSpandek]
    }
    type pageDLaporanSales{
      count: Int 
      rows: [DLaporanSales]
    }
    type pageDLaporanQualityControlPipa{
      count: Int 
      rows: [DLaporanQualityControlPipa]
    }
    type pageDLaporanProduksiPipa{
      count: Int 
      rows: [DLaporanProduksiPipa]
    }
    type pageAbsensi{
      count: Int 
      rows: [Absensi]
    }
    type pageKaryawan{
      count: Int 
      rows: [Karyawan]
    }
    type pageKontrakKaryawan{
      count: Int 
      rows: [HKontrakKaryawan]
    }
    type pageHPinjamUang{
      count: Int 
      rows: [HPinjamUang]
    }
    type pageHPembayaranGaji{
      count: Int 
      rows: [HPembayaranGaji]
    }
    type pagePermintaanPromosiJabatan{
      count: Int 
      rows: [PermintaanPromosiJabatan]
    }
    type pagePermintaan{
      count: Int 
      rows: [Permintaan]
    }
    type pagePermintaanSurat{
      count: Int 
      rows: [PermintaanSurat]
    }
    type pagePermintaanSuratPerintah{
      count: Int 
      rows: [PermintaanSuratPerintah]
    }
    type summaryProduksi{
      idPelapor: Int 
      jumlahProduksi: Int 
      jumlahBanding: Int 
      jumlahPengantaran: Int 
      jumlahProduksiFloat: Float 
      jumlahBSFloat: Float
      jumlahBS: Int 
      tidakCapaiTarget: Int 
      karyawan: Karyawan
      supir: Karyawan
    }
    type File{
      url: String!
    }
    input UraianDraft {
      namaUraian: String 
      nilaiUraian: Int 
    }
    input uLaporanInput {
      id: String 
      nilaiUraian: Int 
    }
    input stokistPipaInput {
      merkPipa: String 
      jenisPipa: String 
      ukuranPipa: String 
      jumlahPipa: Int 
    }
    input stokistPipaEditInput {
      id: String
      LaporanStokId: Int 
      merkBarang: String 
      tipeBarang: String 
      ukuranBarang: String 
      jumlahPipa: Int 
      action: String
      baru: Boolean
      panjangPipa: Float 
      beratPipa: Float 
      totalBaik: Int 
      totalBS: Int 
    }
    input dLaporanArmadaInput{
      id: String
      merkBarang: String 
      tipeBarang: String 
      ukuranBarang: String 
      jumlahBarang: Int 
      action: String
      baru: Boolean
    }
    input ULaporanCatTegelInput{
      id: String 
      namaBahan: String 
      jumlahBahan: Int 
      satuanBahan: String 
      action: String 
      baru: Boolean
    }
    input InventarisSekuritiInput{
      namaBarang: String 
      jumlahBarang: Int 
      baik: Boolean
      keterangan: String 
    }
    input absensiInput{
      id: Int 
      tanggal: MyDate
      jamKerja: String 
      scanMasuk: String 
      scanPulang: String 
      terlambat: String 
      jamBolos: String 
      absen: Boolean
      lembur: String 
    }
    input AnswerInput{
      id: Int 
      text: String
    }
    input AnswerIntInput{
      id: Int 
      text: Int 
    }
    input ListNilaiInput{
      id: Int 
      hasil: Float 
    }
    input indexKontrakInput{
      id: Int
      total: Int 
    }
  type Query {
    getUsers: [User]!
    getUser(
      usernameku: String!
    ): [User]!
    getJabatan: [Jabatan]!
    loginWebsite(
      username: String! password: String!
    ): User!
    loginMobile(
      username: String! password: String!
    ): User!
    getPermintaans(
      page: Int 
      limit: Int 
    ): pagePermintaan
    getPermintaansMaster(
      page: Int 
      limit: Int 
      orderBy: String 
      karyawan: Int 
      bulan: MyDate
      status: Int 
    ): pagePermintaan
    getListIzinPribadi(
      page: Int 
      limit: Int 
      status: Int 
    ): pagePermintaan
    getPermintaan(id: Int!): Permintaan!
    getListSurat(
      page: Int 
      limit: Int 
      status: Int 
    ): pagePermintaanSurat
    getListSuratMaster(
      page: Int 
      limit: Int 
      orderBy: String 
      karyawan: Int 
      bulan: MyDate
      status: Int 
    ): pagePermintaanSurat
    getListSuratPerintah(
      page: Int 
      limit: Int 
      status: Int 
    ): pagePermintaanSuratPerintah
    getListSuratPerintahMaster(
      page: Int 
      limit: Int 
      orderBy: String 
      karyawan: Int 
      bulan: MyDate
      status: Int 
    ): pagePermintaanSuratPerintah
    getKaryawan: Karyawan!
    getDivisi: Jabatan!
    getTarget: [TargetKerja]!
    getListDivisi: [Divisi]
    getLaporans(
      status: Int
      page: Int 
      limit: Int 
    ): pageHLaporanMixerPipa
    getLaporansVerifikasiProduksiPipa(
      status: Int
      page: Int 
      limit: Int
    ): pageDLaporanProduksiPipa
    getULaporanProduksiPipa(
      idDLaporan: String
    ): [ULaporanProduksiPipa]
    getHLaporansProduksiPipa(
      status: Int
      page: Int 
      limit: Int
    ): pageHLaporanProduksiPipa
    getDLaporanProduksiPipa(
      HLaporanProduksiPipaId: String
    ): [DLaporanProduksiPipa]
    getLaporansVerifikasiQualityControlPipa(
      status: Int
      page: Int 
      limit: Int 
    ): pageDLaporanQualityControlPipa
    getHLaporansQualityControlPipa(
      status: Int
      page: Int 
      limit: Int
    ): pageHLaporanQualityControl
    getDLaporanQualityControlPipa(
      HLaporanQualityControlPipaId: String
    ): [DLaporanQualityControlPipa]
    getLaporansVerifikasiStokistPipa(
      status: Int
      page: Int 
      limit: Int 
    ): pageHLaporanStokistPipa
    getDLaporanStokistPipa(
      id: String 
    ): [DLaporanStokistPipa]
    getLaporanMasukStokistPipa(
      jenisLaporan: String
      page: Int 
      limit: Int 
    ): pageLaporanKeluarMasukPipa
    getAnggotaArmada: [Karyawan]
    getLaporansKetuaArmada(
      status: Int
      page: Int 
      limit: Int 
    ): pageHLaporanAramada
    getDLaporanKetuaArmada(
      id: String
    ): [DLaporanArmada]
    getStokBarang: [LaporanStok]
    getLaporanCatTegel(
      jenisProduk: String 
      page: Int 
      limit: Int 
    ): pageDLaporanCatTegel
    getULaporanCatTegel(
      id: String
    ): [ULaporanCatTegel]
    getLaporansVerifikasiSpandek(
      status: Int 
      jenisProduk: String
      page: Int 
      limit: Int 
    ): pageDLaporanSpandek
    getLaporansVerifikasiHollow(
      status: Int
      page: Int 
      limit: Int 
    ): pageDLaporanHollow
    getHLaporansSpandek(
      jenisProduk: String
      page: Int 
      limit: Int 
    ): pageHLaporanSpandek
    getHLaporansHollow(
      page: Int 
      limit: Int 
    ): pageHLaporanHollow
    getDLaporansHollow(
      id: String
    ): [DLaporanHollow]
    getDLaporansSpandek(
      id: String
    ): [DLaporanSpandek]
    getGudang: [Gudang]
    getListGudang: [Gudang]
    getLaporanDinasKu: HLaporanSekuriti
    getHLaporansSekuriti(
      page: Int 
      limit: Int 
    ): pageHLaporanSekuriti
    getDLaporanSekuriti(
      id: String
    ): HLaporanSekuriti
    getLaporansSales(
      status: Int
      page: Int 
      limit: Int 
    ): pageDLaporanSales
    getHLaporansSales(
      status: Int
      page: Int 
      limit: Int 
    ): pageHLaporanSales
    getDLaporanSales(
      id: String
    ): [DLaporanSales]
    getAbsensi(
      page: Int 
      limit: Int 
      tglAwal: MyDate
      tglAkhir: MyDate
    ): pageAbsensi
    getAbsensiKu(
      page: Int 
      limit: Int 
    ): pageAbsensi
    getKuisioner: [ListKuisioner]
    getKuisionerMobile: [ListKuisioner]
    getPertanyaan(
      KuisionerId: Int 
    ): [ListPertanyaan]
    getDistribusi(
      KuisionerId: Int 
    ): [ListDistribusiKuisioner]
    getListKaryawanKuisioner(
      divisi: String
      status: String 
    ): [Karyawan]
    getListKaryawan(
      divisi: String
    ): [Karyawan]
    getTanggapanMobile(
      KuisionerId: Int 
    ): [ListPertanyaan]
    getTanggapanWeb(
      KuisionerId: Int 
      idKaryawan: Int 
      tanggal: MyDate
    ): [ListPertanyaan]
    getIndexPenilaian: [IndexPenilaian]
    getPinjaman: HPinjamUang
    getIzin: [Izin]
    getIzinMobile: [Izin]
    getPermintaanDataDiri: [LaporanDataDiri]
    getListKaryawanMaster(
      page: Int 
      limit: Int 
    ): pageKaryawan
    getKaryawanKu(
      id: Int
    ): Karyawan
    getListJabatan: [Jabatan]
    getNilaiKaryawan(
      page: Int 
      limit: Int 
      orderBy: String 
      karyawan: Int 
      bulan: MyDate
      divisi: String 
    ): pageKaryawan
    getIndexGaji(
      status: Boolean
    ): [IndexGaji]
    getIndexIuran(
      status: Boolean
    ): [IndexIuran]
    getKontrakKaryawan(
      page: Int 
      limit: Int 
      orderBy: String 
      karyawan: Int 
      bulan: MyDate
      status: Int 
    ): pageKontrakKaryawan
    getKontrakKu: HKontrakKaryawan 
    getRequestKontrakKu: HKontrakKaryawan 
    getDetailKontrak(
      id: String 
    ): HKontrakKaryawan
    getListPinjaman(
      page: Int 
      limit: Int 
      orderBy: String 
      karyawan: Int 
      bulan: MyDate
      status: Int 
    ): pageHPinjamUang
    getListPinjamanKeuangan(
      status: Int 
      page: Int 
      limit: Int 
    ): pageHPinjamUang
    getPermintaanPinjamanDiri: [HPinjamUang]
    getDetailPinjaman(
      id: String
    ): [DPinjamUang]
    getPengaruhNilai: [PengaruhNilai]
    getListAnggota: [Karyawan]
    getListAnggotaDivisi: [Karyawan]
    getPembagianGroup: Divisi
    getListPembagianAnggota: [PembagianAnggota]
    getMasterListPembagianAnggota(
      divisi: String 
    ): [PembagianAnggota]
    getLaporanMasterProduksiPipa(
      page: Int 
      limit: Int 
      orderBy: String 
      karyawan: Int 
      bulan: MyDate
      status: Int 
      banding: Int 
    ): pageHLaporanProduksiPipa
    getListKaryawanLaporan(
      divisi: String 
    ): [Karyawan]
    getLaporanMasterMixerPipa(
      page: Int 
      limit: Int 
      orderBy: String 
      karyawan: Int 
      bulan: MyDate
      status: Int 
      banding: Int 
    ): pageHLaporanMixerPipa
    getLaporanMasterQualityControl(
      page: Int 
      limit: Int 
      orderBy: String 
      karyawan: Int 
      bulan: MyDate
      status: Int 
      banding: Int 
    ): pageHLaporanQualityControl
    getLaporanMasterStokistPipa(
      page: Int 
      limit: Int 
      orderBy: String 
      karyawan: Int 
      bulan: MyDate
      status: Int 
      banding: Int 
    ): pageHLaporanStokistPipa
    getLaporanMasterArmada(
      page: Int 
      limit: Int 
      orderBy: String 
      karyawan: Int 
      bulan: MyDate
      status: Int 
      banding: Int 
    ): pageHLaporanAramada
    getLaporanMasterCatTegel(
      page: Int 
      limit: Int 
      orderBy: String 
      merk: String 
      bulan: MyDate
      status: Int 
      banding: Int 
    ): pageDLaporanCatTegel
    getListMerkCatTegel: [DLaporanCatTegel]
    getLaporanMasterSpandek(
      page: Int 
      limit: Int 
      orderBy: String 
      karyawan: Int  
      bulan: MyDate
      status: Int 
      banding: Int 
    ): pageDLaporanSpandek
    getLaporanMasterHollow(
      page: Int 
      limit: Int 
      orderBy: String 
      karyawan: Int  
      bulan: MyDate
      status: Int 
      banding: Int 
    ): pageDLaporanHollow
    getLaporanMasterSekuriti(
      page: Int 
      limit: Int 
      orderBy: String 
      gudang: Int  
      bulan: MyDate
      status: Int 
      banding: Int 
    ): pageHLaporanSekuriti
    getLaporanMasterSales(
      page: Int 
      limit: Int 
      orderBy: String 
      karyawan: Int  
      bulan: MyDate
      status: Int 
      banding: Int 
    ): pageHLaporanSales
    getSummaryProduksiPipa: [summaryProduksi]
    getSummaryMixerPipa: [summaryProduksi]
    getSummaryQualityControlPipa: [summaryProduksi]
    getSummaryStokistPipa: [summaryProduksi]
    getSummaryArmada: [summaryProduksi]
    getSummarySpandek: [summaryProduksi]
    getSummaryHollow: [summaryProduksi]
    getSummarySales: [summaryProduksi]
    getListKaryawanPembayaranGaji(
      divisi: String 
    ): [Karyawan]
    getListKaryawanKontrak(
      divisi: String 
    ): [Karyawan]
    getPembayaranGaji(
      page: Int 
      limit: Int 
      orderBy: String 
      karyawan: Int  
      bulan: MyDate
      status: Int 
    ): pageHPembayaranGaji
    getDetailPembayaranGaji(
      id: String 
    ): [DPembayaranGaji]
    getPembayaranGajiKaryawan(
      page: Int 
      limit: Int 
      orderBy: String 
      status: Int 
    ): pageHPembayaranGaji
    getListPermintaanPromosiKetua(
      page: Int 
      limit: Int 
      status: Int 
    ): pagePermintaanPromosiJabatan
    getListPermintaanPromosiMaster(
      page: Int 
      limit: Int 
      status: Int 
      orderBy: String 
    ): pagePermintaanPromosiJabatan
  }
  type Mutation{
    registerUser(
      id: Int!
      username: String!
      idJabatan: Int!
    ): User!
    registerKaryawan(
      id: Int 
      nama: String
      nik: String
      noTelp: String 
      tanggalMasuk: MyDate
      tempatLahir: String
      tanggalLahir: MyDate
      alamat: String
      agama: String
      pendidikan: String
      file: Upload
      idJabatan: Int
    ): Karyawan!
    updateKaryawan(
      id: Int 
      idPermintaan: Int 
      nama: String
      nik: String
      noTelp: String 
      tanggalMasuk: MyDate
      tempatLahir: String
      tanggalLahir: MyDate
      alamat: String
      agama: String
      pendidikan: String
      file: Upload
    ): Karyawan
    deleteUser(
      id: Int!
    ): User
    registerPermintaan(
      idPeminta: Int
      IzinId: Int
      tanggalMulai: MyDate
      tanggalBerakhir: MyDate
      keterangan: String
      file: Upload
      status: Int
      idKetua: Int
      idHRD: Int
    ): Permintaan!
    updateStatusPermintaan(
      id: String 
      status: Int
      alasan: String
    ): Permintaan
    registerPermintaanSurat(
      jenisSurat: String 
      tanggal: MyDate
      keterangan: String 
    ): PermintaanSurat
    updateStatusSurat(
      id: String 
      status: Int 
      keteranganHRD: String 
    ): PermintaanSurat
    registerPermintaanSuratPerintah(
      idKaryawan: Int 
      dinas: String 
      tanggalMulai: MyDate
      tanggalAkhir: MyDate
      keterangan: String 
    ): PermintaanSuratPerintah
    updateStatusSuratPerintah(
      id: String 
      status: Int 
      keterangan: String 
    ): PermintaanSuratPerintah
    updateStatusSuratPerintahMaster(
      id: String 
      status: Int 
    ): PermintaanSuratPerintah
    changePassword(
      passwordLama: String
      passwordBaru: String
      passwordConfirm: String
    ): User
    uploadFile(
      file: Upload!
      id: Int
    ): File!
    uploadFoto(
      file: Upload!
    ): File!
    updateTarget(
      jumlahTarget: Int
    ): TargetKerja
    registerMesin(
      id: Int 
      namaMesin: String 
    ): TipeMesin
    updateTargetMixer(
      targetMixer1: Int
      targetMixer2: Int
      targetMixer3: Int
      targetMixer4: Int
    ): TargetKerja
    tambahLaporan(
      tipeMesin: String
      bahanDigunakan: Int 
      totalHasil: Int 
      targetMixer: Int
      file: Upload
      keterangan: String
    ): LaporanMixerPipa
    updateStatusLaporan(
      id: String
      status: Int
      keteranganBanding: String
    ): LaporanMixerPipa
    updateLaporan(
      id: String 
      tipeMesin: String 
      bahanDigunakan: Int 
      totalHasil: Int 
      keterangan: String
    ): LaporanMixerPipa
    updateTargetProduksiPipa(
      targetProduksi: Int
    ): TargetKerja
    tambahLaporanProduksiPipa(
      shift: String
      tipeMesin: String
      jamLaporan: String
      totalProduksi: Int 
      targetProduksi: Int 
      file: Upload
      keterangan: String
      uraian: [UraianDraft]
    ): DLaporanProduksiPipa
    updateStatusLaporanProduksiPipa(
      id: String
      status: Int
      keteranganBanding: String
    ): DLaporanProduksiPipa
    updateULaporanProduksiPipa(
      id: String
      totalProduksi: Int 
      uLaporan: [uLaporanInput]
      keterangan: String 
    ): DLaporanProduksiPipa
    updateHLaporanProduksiPipa(
      id: String 
      warna: String 
      ukuran: Int 
      dis: Int 
      pin: Int 
      jumlahBahan: Int 
      BS: Int 
      totalBahan: Int 
    ): HLaporanProduksiPipa
    tambahLaporanQualityControlPipa(
      shift: String 
      tipeMesin: String 
      jamLaporan: String
      file: Upload
      keterangan: String
      diameter: Float 
      panjang: Float 
      berat: Float 
    ): DLaporanQualityControlPipa
    updateStatusLaporanQualityControlPipa(
      id: String
      status: Int
      keteranganBanding: String
    ): DLaporanQualityControlPipa
    updateDLaporanQualityControlPipa(
      id: String 
      diameter: Float 
      panjang: Float 
      berat: Float 
      keterangan: String
    ): DLaporanProduksiPipa
    updateHLaporanQualityControlPipa(
      id: String 
      merk: String 
      ketebalan: Float
      panjang: Float 
      diameterLuar: Float 
      diameterDalam: Float 
      totalReject: Int 
      totalProduksi: Int 
    ): HLaporanQualityControlPipa
    tambahLaporanAnggotaStokistPipa(
      shift: String 
      stokistPipa: [stokistPipaInput]
      file: Upload 
      keterangan: String 
    ): HLaporanStokistPipa
    updateStatusLaporanStokistPipa(
      id: String 
      status: Int 
      keteranganBanding: String 
      stokistPipaEdit: [stokistPipaEditInput]
    ): HLaporanStokistPipa
    updateDLaporanStokistPipa(
      id: String 
      stokistPipaEdit: [stokistPipaEditInput]
      keterangan: String 
    ): HLaporanStokistPipa
    tambahLaporanKetuaStokistPipa(
      shift: String 
      merkPipa: String 
      jenisPipa: String
      ukuranPipa: String 
      warnaPipa: String 
      panjangPipa: Float
      beratPipa: Float 
      totalBaik: Int 
      totalBS: Int 
      keterangan: String 
    ): HLaporanKetuaStokistPipa
    tambahLaporanKetuaArmada(
      idNota: String 
      idSupir: Int 
      idKernet: Int 
      penerima: String 
      dLaporanArmada: [dLaporanArmadaInput]
      file: Upload 
      keterangan: String
    ): HLaporanArmada
    updateLaporanKetuaArmada(
      id: String 
      idSupir: Int 
      idKernet: Int 
      penerima: String 
      dLaporanArmada: [dLaporanArmadaInput]
      keterangan: String 
    ): HLaporanArmada
    updateStatusLaporanArmada(
      id: String 
      status: Int 
      penerima: String 
    ): HLaporanArmada
    tambahLaporanKetuaCatTegel(
      jenisProduk: String 
      merkProduk: String 
      warna: String 
      jumlahProduk: Int 
      satuanProduk: String 
      file: Upload
      keterangan: String 
      bahanCatTegel: [ULaporanCatTegelInput]
    ): HLaporanCatTegel
    updateLaporanKetuaCatTegel(
      id: String 
      merkProduk: String 
      warna: String 
      jumlahProduk: Int 
      satuanProduk: String 
      keterangan: String 
      bahanCatTegel: [ULaporanCatTegelInput]
    ): DLaporanCatTegel
    tambahLaporanHollow(
      ukuran: String 
      ketebalan: Float
      berat: Float
      noCoil: String 
      jumlah: Int 
      BS: Int 
      file: Upload
      keterangan: String 
    ): HLaporanHollow
    tambahLaporanSpandek(
      jenisProduk: String 
      namaPemesan: String 
      warna: String 
      ukuran: Float 
      berat: Float
      panjang: Float 
      BS: Float 
      noCoil: String 
      file: Upload 
      keterangan: String 
    ): HLaporanSpandek
    updateDLaporanHollow(
      id: String 
      ukuran: String 
      ketebalan: Float
      berat: Float
      noCoil: String 
      jumlah: Int 
      BS: Int 
      keterangan: String
    ): DLaporanHollow
    updateDLaporanSpandek(
      id: String 
      namaPemesan: String 
      warna: String 
      ukuran: Float 
      berat: Float
      panjang: Float 
      BS: Float 
      noCoil: String 
      keterangan: String 
    ): DLaporanSpandek
    updateStatusLaporanHollow(
      id: String 
      status: Int 
      keteranganBanding: String 
    ): HLaporanHollow
    updateStatusLaporanSpandek(
      id: String 
      status: Int 
      keteranganBanding: String 
    ): HLaporanSpandek
    registerGudang(
      namaGudang: String 
      alamatGudang: String 
    ): Gudang
    updateGudang(
      id: Int 
      namaGudang: String 
      alamatGudang: String 
    ): Gudang
    updateStatusGudang(
      id: Int 
      status: Boolean
    ): Gudang
    tambahLaporanDinasSekuriti(
      counterTgl: MyDate
      GudangId: Int 
      shift: String 
      status: String
      noHT: String 
      keterangan: String 
    ): DLaporanDinasSekuriti
    tambahLaporanInventarisSekuriti(
      counterTgl: MyDate
      GudangId: Int 
      shift: String 
      inventarisSekuriti: [InventarisSekuritiInput]
    ): HLaporanSekuriti
    tambahLaporanMutasiSekuriti(
      counterTgl: MyDate
      GudangId: Int 
      shift: String 
      jamLaporan: String
      uraian: String 
      file: Upload
      keterangan: String 
    ): DLaporanMutasiSekuriti
    updateHLaporanSekuriti(
      id: String 
      status: String 
    ): HLaporanSekuriti
    tambahLaporanSales(
      namaToko: String 
      file: Upload
      keterangan: String 
    ): DLaporanSales
    updateCheckOutLaporanSales(
      id: String 
      keterangan: String 
    ): DLaporanSales
    updateStatusLaporanSales(
      id: String 
      status: Int 
    ): HLaporanSales
    updateKeteranganKejadian(
      id: String 
      keteranganKejadian: String
    ): HLaporanSales
    updateFeedback(
      id: String 
      feedbackKaryawan: String 
    ): HLaporanSales
    registerAbsensi(
      status: String 
      absensiInput: [absensiInput]
    ): Absensi
    registerJamKerja( 
      namaShift: String 
      jamMasuk: String 
      jamKeluar: String 
    ): JamKerja 
    registerKuisioner(
      divisi: String 
      namaKuisioner: String 
      deskripsiKuisioner: String 
      jenisKuisioner: String 
    ): ListKuisioner
    registerPertanyaan(
      KuisionerId: Int 
      teskPertanyaan: String 
      jenisPertanyaan: String 
      teskJawaban: String 
      jawabanRadio: [String]
    ): ListPertanyaan
    tambahTanggapanKuisioner(
      KuisionerId: Int
      answerText: [AnswerInput]
      answerRadio: [AnswerIntInput]
      answerPilihan: [AnswerIntInput]
      answerOpsi: [AnswerInput]
    ): ListTanggapan
    updateKuisioner(
      id: Int 
      divisi: String 
      namaKuisioner: String 
      deskripsiKuisioner: String 
      jenisKuisioner: String 
    ): ListKuisioner
    updatePertanyaan(
      idJawaban: Int 
      teskJawaban: String 
      jawabanRadio: [String]
    ): ListPertanyaan
    updateStatusPertanyaan(
      id: Int 
      status: Boolean
    ): ListPertanyaan
    updateStatusKuisioner(
      id: Int 
      status: Boolean 
    ): ListKuisioner
    registerDistribusi(
      ListKuisionerId: Int 
      TingkatJabatan: Int 
      persentaseNilai: Int 
    ): ListDistribusiKuisioner
    updateStatusDistribusi(
      id: Int 
      status: Boolean
    ): ListDistribusiKuisioner
    registerIndexPenilaian(
      namaIndex: String 
      nilaiIndex: Int 
      keteranganIndex: String 
    ): IndexPenilaian
    updateStatusIndexPenilaian(
      id: Int 
      status: Boolean 
    ): IndexPenilaian
    updateIndexPenilaian(
      id: Int 
      namaIndex: String 
      nilaiIndex: Int 
      keteranganIndex: String 
    ): IndexPenilaian
    registerNilaiHRD(
      idKaryawan: Int 
      ListNilaiInput: [ListNilaiInput]
    ): PenilaianHRD
    registerPinjaman(
      jumlahPinjam: Int 
      cicilan: Int 
      keteranganPinjam: String 
    ): HPinjamUang
    updateHPinjaman(
      id: String 
      status: Boolean 
      keterangan: String 
    ): HPinjamUang
    updateStatusPinjamanKeuangan(
      id: String 
      status: Int 
    ): HPinjamUang
    updateStatusPinjamanKaryawan(
      id: String 
      status: Int 
    ): HPinjamUang
    registerIzin(
      namaIzin: String 
      totalIzin: Int 
      keterangan: String 
      batasanHari: Boolean
    ): Izin
    updateIzin(
      id: Int 
      namaIzin: String 
      totalIzin: Int 
      keterangan: String 
      batasanHari: Boolean
    ): Izin
    updateStatusIzin(
      id: Int 
      status: Boolean 
    ): Izin
    registerLaporanDataDiri(
      bagianData: String 
      dataSeharusnya: String 
    ): LaporanDataDiri
    registerIndexGaji(
      namaGaji: String 
      keteranganGaji: String 
    ): IndexGaji
    updateStatusIndexGaji(
      id: Int 
      status: Boolean 
    ): IndexGaji
    updateIndexGaji(
      id: Int 
      namaGaji: String 
      keteranganGaji: String 
    ): IndexGaji
    registerIndexIuran(
      namaIuran: String 
      keteranganIuran: String 
    ): IndexIuran
    updateStatusIndexIuran(
      id: Int 
      status: Boolean 
    ): IndexIuran
    updateIndexIuran(
      id: Int 
      namaIuran: String 
      keteranganIuran: String 
    ): IndexIuran
    registerKontrakKaryawan(
      idKaryawan: Int 
      jenisKontrak: String 
      gaji: [indexKontrakInput]
      iuran: [indexKontrakInput]
      tanggalMulai: MyDate
      tanggalBerakhir: MyDate
    ): HKontrakKaryawan
    updateStatusKontrak(
      status: String 
      id: String 
    ): HKontrakKaryawan
    updateStatusKontrakMaster(
      status: Boolean 
      id: String 
    ): HKontrakKaryawan
    registerPengaruhNilai(
      nilaiMin: Float 
      nilaiMax: Float 
      hasilNilai: String 
      pengurangan: Boolean
      nilaiUang: Int 
    ): PengaruhNilai
    updatePengaruhNilai(
      id: Int 
      nilaiMin: Float 
      nilaiMax: Float 
      hasilNilai: String 
      pengurangan: Boolean 
      nilaiUang: Int 
    ): PengaruhNilai
    updatePembagianDivisi(
      id: Int 
      jumlahGroup: Int 
    ): Divisi
    registerAnggota(
      idKaryawan: Int 
      groupKaryawan: Int 
    ): PembagianAnggota
    keluarkanAnggota(
      id: Int 
    ): PembagianAnggota
    registerPembayaranGaji(
      idKaryawan: Int 
      jumlahLembur: Int 
    ): HPembayaranGaji
    updateStatusPembayaranGaji(
      id: String 
      status: Boolean
    ): HPembayaranGaji
    updateStatusPembayaranGajiKeuangan(
      id: String 
      status: Int 
    ): HPembayaranGaji
    updateStatusPembayaranGajiKaryawan(
      id: String 
      status: Int 
    ): HPembayaranGaji
    registerPermintaanPromosi(
      idKaryawan: Int 
      promosi: String 
      keterangan: String 
    ): PermintaanPromosiJabatan
    updateStatusPermintaanPromosi(
      id: Int 
      status: Int 
      keterangan: String 
    ): PermintaanPromosiJabatan
  }
`