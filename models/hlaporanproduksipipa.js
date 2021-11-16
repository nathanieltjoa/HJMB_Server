'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HLaporanProduksiPipa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //HLaporanProduksiPipa.hasMany(models.DLaporanProduksiPipa,{as: 'idHLaporan_Constraint'})
    }
  };
  HLaporanProduksiPipa.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
      autoIncrement: false,
    },
    shift:  {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    jenisPipa:  {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    tipeMesin:  {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    warna:  {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    ukuran:  {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    idPelapor: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
    },
    idKetua: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
    },
    dis: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
    },
    pin: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
    },
    hasilProduksi: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
    },
    jumlahBahan: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
    },
    BS: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
    },
    totalBahan: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
  }, {
    sequelize,
    modelName: 'HLaporanProduksiPipa',
    tableName: 'hlaporanproduksipipa',
  });
  HLaporanProduksiPipa.associate = function(models){
    HLaporanProduksiPipa.hasMany(models.DLaporanProduksiPipa,{as: 'dLaporan'})
    HLaporanProduksiPipa.belongsTo(models.Karyawan, {foreignKey: 'idPelapor',as: 'karyawan'})
    HLaporanProduksiPipa.belongsTo(models.Karyawan, {foreignKey: 'idKetua',as: 'ketua'})
  }
  return HLaporanProduksiPipa;
};