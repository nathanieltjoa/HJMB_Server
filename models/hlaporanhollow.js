'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HLaporanHollow extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  HLaporanHollow.init({
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
    idPelapor:  {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    idKetua:  {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    totalBerat:  {
      type: DataTypes.FLOAT,
      allowNull: false,
      unique: true,
    },
    totalJumlah:  {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    totalBS:  {
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
    modelName: 'HLaporanHollow',
    tableName: 'hlaporanhollow',
  });
  HLaporanHollow.associate = function(models){
    HLaporanHollow.hasMany(models.DLaporanHollow,{as: 'dLaporanHollow'})
    HLaporanHollow.belongsTo(models.Karyawan, {foreignKey: 'idPelapor',as: 'karyawan'})
    HLaporanHollow.belongsTo(models.Karyawan, {foreignKey: 'idKetua',as: 'ketua'})
  }
  return HLaporanHollow;
};