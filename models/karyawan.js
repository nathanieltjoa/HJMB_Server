'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Karyawan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Karyawan.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    nik: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    noTelp: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    tanggalMasuk: {
      type: DataTypes.DATE,
      allowNull: false,
      unique: true,
    },
    tempatLahir: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    tanggalLahir: {
      type: DataTypes.DATE,
      allowNull: false,
      unique: true,
    },
    alamat: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    agama: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    pendidikan: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    foto: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    JabatanId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
  }, {
    sequelize,
    modelName: 'Karyawan',
    tableName: 'karyawan',
  });
  Karyawan.associate = function(models){
    Karyawan.belongsTo(models.Jabatan, {foreignKey: 'JabatanId',as: 'jabatan'})
    Karyawan.hasMany(models.Absensi,{foreignKey: 'idKaryawan',as: 'AbsensiKaryawan'})
    Karyawan.hasMany(models.HPenilaianHRD,{foreignKey: 'idKaryawan',as: 'hPenilaianHRD'})
    Karyawan.hasMany(models.HPenilaianKuisioner,{foreignKey: 'idKaryawan', as: 'hPenilaianKuisioner'})
    Karyawan.hasMany(models.DPenilaianKuisioner,{foreignKey: 'idPenilai', as: 'dPenilaianKuisioner'})
    Karyawan.hasMany(models.HKontrakKaryawan,{foreignKey: 'idKaryawan', as: 'kontrak'})
    Karyawan.hasMany(models.HPinjamUang,{foreignKey: 'idKaryawan', as: 'hPinjamUangKaryawan'})
    Karyawan.hasMany(models.HPinjamUang,{foreignKey: 'idKeuangan', as: 'hPinjamUangKeuangan'})
    Karyawan.hasMany(models.HPinjamUang,{foreignKey: 'idHRD', as: 'hPinjamUangHRD'})
    Karyawan.hasMany(models.PembagianAnggota,{foreignKey: 'idKaryawan', as: 'pembagianAnggotaKaryawan'})
    Karyawan.hasMany(models.HLaporanProduksiPipa,{foreignKey: 'idPelapor', as: 'hProduksiPipaKaryawan'})
    Karyawan.hasMany(models.HLaporanProduksiPipa,{foreignKey: 'idKetua', as: 'hProduksiPipaKetua'})
    Karyawan.hasMany(models.LaporanMixerPipa,{foreignKey: 'idPelapor', as: 'hMixerPipaKaryawan'})
    Karyawan.hasMany(models.LaporanMixerPipa,{foreignKey: 'idKetua', as: 'hMixerPipaKetua'})
    Karyawan.hasMany(models.HLaporanQualityControlPipa,{foreignKey: 'idPelapor', as: 'hQCPipaKaryawan'})
    Karyawan.hasMany(models.HLaporanQualityControlPipa,{foreignKey: 'idKetua', as: 'hQCPipaKetua'})
    Karyawan.hasMany(models.HLaporanStokistPipa,{foreignKey: 'idPelapor', as: 'hStokistPipaKaryawan'})
    Karyawan.hasMany(models.HLaporanStokistPipa,{foreignKey: 'idKetua', as: 'hStokistPipaKetua'})
    Karyawan.hasMany(models.HLaporanArmada,{foreignKey: 'idArmada', as: 'hStokistPipaArmada'})
    Karyawan.hasMany(models.HLaporanArmada,{foreignKey: 'idStokist', as: 'hStokistPipaStokist'})
    Karyawan.hasMany(models.HLaporanArmada,{foreignKey: 'idSupir', as: 'hStokistPipaSupir'})
    Karyawan.hasMany(models.HLaporanArmada,{foreignKey: 'idKernet', as: 'hStokistPipaKernet'})
    Karyawan.hasMany(models.HLaporanCatTegel,{foreignKey: 'idPelapor', as: 'hCatTegelKaryawan'})
    Karyawan.hasMany(models.HLaporanSpandek,{foreignKey: 'idPelapor', as: 'hSpandekKaryawan'})
    Karyawan.hasMany(models.HLaporanSpandek,{foreignKey: 'idKetua', as: 'hSpandekKetua'})
    Karyawan.hasMany(models.HLaporanHollow,{foreignKey: 'idPelapor', as: 'hHollowKaryawan'})
    Karyawan.hasMany(models.HLaporanHollow,{foreignKey: 'idKetua', as: 'hHollowKetua'})
    Karyawan.hasMany(models.HLaporanSekuriti,{foreignKey: 'idKetua', as: 'hSekuritiKetua'})
    Karyawan.hasMany(models.HLaporanSekuriti,{foreignKey: 'idPenyerah', as: 'hSekuritiPenyerah'})
    Karyawan.hasMany(models.HLaporanSekuriti,{foreignKey: 'idPenerima', as: 'hSekuritiPenerima'})
    Karyawan.hasMany(models.HLaporanSales,{foreignKey: 'idPelapor', as: 'hSalesKaryawan'})
    Karyawan.hasMany(models.HLaporanSales,{foreignKey: 'idKetua', as: 'hSalesKetua'})
    Karyawan.hasMany(models.HPembayaranGaji,{foreignKey: 'idHRD', as: 'hPembayaranGajiHRD'})
    Karyawan.hasMany(models.HPembayaranGaji,{foreignKey: 'idKeuangan', as: 'hPembayaranGajiKeuangan'})
    Karyawan.hasMany(models.HPembayaranGaji,{foreignKey: 'verifikasiKaryawan', as: 'hPembayaranGajiKaryawan'})
    Karyawan.hasMany(models.PermintaanPromosiJabatan,{foreignKey: 'idPenerima', as: 'PermintaanPromosiPenerima'})
    Karyawan.hasMany(models.PermintaanPromosiJabatan,{foreignKey: 'idPelapor', as: 'PermintaanPromosiPelapor'})
    Karyawan.hasMany(models.PermintaanPromosiJabatan,{foreignKey: 'idKaryawan', as: 'PermintaanPromosiKaryawan'})
    Karyawan.hasMany(models.Permintaan,{foreignKey: 'idPeminta', as: 'PermintaanKaryawan'})
    Karyawan.hasMany(models.Permintaan,{foreignKey: 'idKetua', as: 'PermintaanKetua'})
    Karyawan.hasMany(models.Permintaan,{foreignKey: 'idHRD', as: 'PermintaanHRD'})
    Karyawan.hasMany(models.PermintaanSurat,{foreignKey: 'idKaryawan', as: 'PermintaanSuratKaryawan'})
    Karyawan.hasMany(models.PermintaanSurat,{foreignKey: 'idHRD', as: 'PermintaanSuratHRD'})
    Karyawan.hasMany(models.PermintaanSuratPerintah,{foreignKey: 'idKaryawan', as: 'PermintaanSuratPerintahKaryawan'})
    Karyawan.hasMany(models.PermintaanSuratPerintah,{foreignKey: 'idHRD', as: 'PermintaanSuratPerintahHRD'})
  }
  return Karyawan;
};