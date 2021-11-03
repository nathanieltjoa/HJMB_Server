'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HPembayaranGaji extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  HPembayaranGaji.init({
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    HKontrakKaryawanId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    verifikasiKaryawan: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      unique: true,
    },
    idKeuangan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    idHRD: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    totalGaji: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    tanggalPembayaran: {
      type: DataTypes.DATE,
      allowNull: false,
      unique: true,
    },
    status: {
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
    modelName: 'HPembayaranGaji',
    tableName: 'HPembayaranGaji',
  });
  HPembayaranGaji.associate = function(models){
    HPembayaranGaji.hasMany(models.DPembayaranGaji,{as: 'dPembayaranGaji'})
    HPembayaranGaji.belongsTo(models.HKontrakKaryawan,{foreignKey: 'HKontrakKaryawanId',as: 'kontrak'})
    HPembayaranGaji.belongsTo(models.Karyawan, {foreignKey: 'idKeuangan',as: 'keuangan'})
    HPembayaranGaji.belongsTo(models.Karyawan, {foreignKey: 'idHRD',as: 'hrd'})
    HPembayaranGaji.belongsTo(models.Karyawan, {foreignKey: 'verifikasiKaryawan',as: 'karyawan'})
  }
  return HPembayaranGaji;
};