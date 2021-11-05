'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DLaporanArmada extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  DLaporanArmada.init({
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    HLaporanArmadaId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    merkBarang: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    tipeBarang: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    ukuranBarang: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    jumlahBarang: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    satuanBarang: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    diHapus: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      unique: true,
    },
  }, {
    sequelize,
    modelName: 'DLaporanArmada',
    tableName: 'dlaporanarmada'
  });
  DLaporanArmada.associate = function(models){
    DLaporanArmada.belongsTo(models.HLaporanArmada, {foreignKey: 'HLaporanArmadaId',as: 'dLaporanArmada'})
  }
  return DLaporanArmada;
};