'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DLaporanSales extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  DLaporanSales.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
      autoIncrement: false,
    },
    HLaporanSalesId:  {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    namaToko:  {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    foto:  {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    keterangan:  {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    jamMasuk:  {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    jamKeluar:  {
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
    modelName: 'DLaporanSales',
    tableName: 'dlaporansales'
  });
  DLaporanSales.associate = function(models){
    DLaporanSales.belongsTo(models.HLaporanSales, {foreignKey: 'HLaporanSalesId',as: 'hLaporanSales'})
  }
  return DLaporanSales;
};