'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HLaporanSekuriti extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  HLaporanSekuriti.init({
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: Sequelize.STRING
    },
    GudangId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    tanggalLaporan: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      unique: true,
    },
    shift: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    idKetua: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    idPenyerah: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    idPenerima: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
  }, {
    sequelize,
    modelName: 'HLaporanSekuriti',
    tableName: 'hlaporansekuriti'
  });
  HLaporanSekuriti.associate = function(models){
    HLaporanSekuriti.hasMany(models.DLaporanDinasSekuriti,{as: 'dLaporanDinasSekuriti'})
    HLaporanSekuriti.hasMany(models.DLaporanInventarisSekuriti,{as: 'dLaporanInventarisSekuriti'})
    HLaporanSekuriti.hasMany(models.DLaporanMutasiSekuriti,{as: 'dLaporanMutasiSekuriti'})
    HLaporanSekuriti.belongsTo(models.Gudang, {foreignKey: 'GudangId',as: 'gudang'})
    HLaporanSekuriti.belongsTo(models.Karyawan, {foreignKey: 'idPenyerah',as: 'penyerah'})
    HLaporanSekuriti.belongsTo(models.Karyawan, {foreignKey: 'idPenerima',as: 'penerima'})
    HLaporanSekuriti.belongsTo(models.Karyawan, {foreignKey: 'idKetua',as: 'ketua'})
  }
  return HLaporanSekuriti;
};