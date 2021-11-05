'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HLaporanSales extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  HLaporanSales.init({
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: Sequelize.STRING
    },
    idPelapor: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    idKetua: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    laporanKejadian: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      unique: true,
    },
    keteranganKejadian: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    feedbackKaryawan: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
  }, {
    sequelize,
    modelName: 'HLaporanSales',
    tableName: 'hlaporansales',
  });
  HLaporanSales.associate = function(models){
    HLaporanSales.hasMany(models.DLaporanSales,{as: 'dLaporanSales', foreignKey: 'HLaporanSalesId'})
    HLaporanSales.belongsTo(models.Karyawan, {foreignKey: 'idPelapor',as: 'karyawan'})
    HLaporanSales.belongsTo(models.Karyawan, {foreignKey: 'idKetua',as: 'ketua'})
  }
  return HLaporanSales;
};