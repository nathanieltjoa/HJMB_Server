'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PermintaanSuratPerintah extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  PermintaanSuratPerintah.init({
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    idKaryawan: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
    },
    idHRD: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
    },
    dinas: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    keterangan: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    tanggalMulai: {
      type: DataTypes.DATE,
      allowNull: true,
      unique: true,
    },
    tanggalAkhir: {
      type: DataTypes.DATE,
      allowNull: true,
      unique: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
    },
    keteranganKaryawan: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    file: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
  }, {
    sequelize,
    modelName: 'PermintaanSuratPerintah',
    tableName: 'permintaansuratperintah',
  });
  PermintaanSuratPerintah.associate = function(models){
    PermintaanSuratPerintah.belongsTo(models.Karyawan, {foreignKey: 'idKaryawan',as: 'karyawan'})
    PermintaanSuratPerintah.belongsTo(models.Karyawan, {foreignKey: 'idHRD',as: 'hrd'})
  }
  return PermintaanSuratPerintah;
};