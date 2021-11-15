'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HLaporanArmada extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  HLaporanArmada.init({
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    idNota: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    idArmada: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    idStokist: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    idSupir: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    idKernet: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    keterangan: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    penerima: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    foto: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    pengantaran: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    kembali: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
  }, {
    sequelize,
    modelName: 'HLaporanArmada',
    tableName: 'hlaporanarmada',
  });
  HLaporanArmada.associate = function(models){
    HLaporanArmada.hasMany(models.DLaporanArmada,{as: 'dLaporanArmada'})
    HLaporanArmada.belongsTo(models.Karyawan, {foreignKey: 'idArmada',as: 'armada'})
    HLaporanArmada.belongsTo(models.Karyawan, {foreignKey: 'idStokist',as: 'stokist'})
    HLaporanArmada.belongsTo(models.Karyawan, {foreignKey: 'idSupir',as: 'supir'})
    HLaporanArmada.belongsTo(models.Karyawan, {foreignKey: 'idKernet',as: 'kernet'})
  }
  return HLaporanArmada;
};