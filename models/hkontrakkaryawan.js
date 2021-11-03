'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HKontrakKaryawan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  HKontrakKaryawan.init({
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    idKaryawan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    idHRD: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    jenisKontrak: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    totalGaji: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    totalIuran: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    tanggalMulai: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      unique: true,
    },
    tanggalBerakhir: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
  }, {
    sequelize,
    modelName: 'HKontrakKaryawan',
    tableName: 'HKontrakKaryawan',
  });
  HKontrakKaryawan.associate = function(models){
    HKontrakKaryawan.hasMany(models.DKontrakGaji,{as: 'dKontrakGaji'})
    HKontrakKaryawan.hasMany(models.DKontrakIuran,{as: 'dKontrakIuran'})
    HKontrakKaryawan.belongsTo(models.Karyawan,{foreignKey: 'idKaryawan',as: 'karyawan'})
    HKontrakKaryawan.hasOne(models.HPembayaranGaji,{foreignKey: 'HKontrakKaryawanId',as: 'hPembayaranGaji'})
  }
  return HKontrakKaryawan;
};