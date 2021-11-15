'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PermintaanSurat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  PermintaanSurat.init({
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    jenisSurat: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    idHRD: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
    },
    idKaryawan: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
    },
    tanggalKerja: {
      type: Sequelize.DATE,
      allowNull: true,
      unique: true,
    },
    file: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    keterangan: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    keteranganHRD: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
  }, {
    sequelize,
    modelName: 'PermintaanSurat',
    tableName: 'permintaansurat'
  });
  PermintaanSurat.associate = function(models){
    PermintaanSurat.belongsTo(models.Karyawan, {foreignKey: 'idKaryawan',as: 'karyawan'})
    PermintaanSurat.belongsTo(models.Karyawan, {foreignKey: 'idHRD',as: 'hrd'})
  }
  return PermintaanSurat;
};