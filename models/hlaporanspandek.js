'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HLaporanSpandek extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  HLaporanSpandek.init({
    id: {
      allowNull: false,
      autoIncrement: true,
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
    jenisProduk: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    totalPanjang: {
      type: DataTypes.FLOAT,
      allowNull: false,
      unique: true,
    },
    totalBS: {
      type: DataTypes.FLOAT,
      allowNull: false,
      unique: true,
    },
    totalBerat: {
      type: DataTypes.FLOAT,
      allowNull: false,
      unique: true,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
  }, {
    sequelize,
    modelName: 'HLaporanSpandek',
    tableName: 'HLaporanSpandek',
  });
  HLaporanSpandek.associate = function(models){
    HLaporanSpandek.hasMany(models.DLaporanSpandek,{as: 'dLaporanSpandek'})
    HLaporanSpandek.belongsTo(models.Karyawan, {foreignKey: 'idPelapor',as: 'karyawan'})
    HLaporanSpandek.belongsTo(models.Karyawan, {foreignKey: 'idKetua',as: 'ketua'})
  }
  return HLaporanSpandek;
};