'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HPinjamUang extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  HPinjamUang.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.STRING
    },
    idKaryawan: {
      type: DataTypes.INTEGER,
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
    jumlahPinjam: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    keteranganPinjam: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    lunas: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      unique: true,
    },
    cicilan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    keteranganHRD: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  }, {
    sequelize,
    modelName: 'HPinjamUang',
    tableName: 'HPinjamUang',
  });
  HPinjamUang.associate = function(models){
    HPinjamUang.hasMany(models.DPinjamUang,{as: 'dPinjamUang'})
    HPinjamUang.belongsTo(models.Karyawan, {foreignKey: 'idKaryawan',as: 'karyawan'})
    HPinjamUang.belongsTo(models.Karyawan, {foreignKey: 'idKeuangan',as: 'keuangan'})
    HPinjamUang.belongsTo(models.Karyawan, {foreignKey: 'idHRD',as: 'hrd'})
  }
  return HPinjamUang;
};