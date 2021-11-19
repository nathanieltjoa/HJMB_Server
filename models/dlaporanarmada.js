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
    idNota: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    penerima: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    keterangan: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    foto: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    diBatalkan: {
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
    DLaporanArmada.belongsTo(models.HLaporanArmada, {foreignKey: 'HLaporanArmadaId',as: 'hLaporan'})
    DLaporanArmada.hasMany(models.ULaporanArmada, {foreignKey: 'DLaporanArmadaId',as: 'uLaporan'})
  }
  return DLaporanArmada;
};