'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PermintaanPromosiJabatan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  PermintaanPromosiJabatan.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    idPenerima: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
    },
    idPelapor: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
    },
    kenaikan: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      unique: true,
    },
    keterangan: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    keteranganDirektur: {
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
    modelName: 'PermintaanPromosiJabatan',
    tableName: 'PermintaanPromosiJabatan',
  });
  PermintaanPromosiJabatan.associate = function(models){
    PermintaanPromosiJabatan.belongsTo(models.Karyawan, {foreignKey: 'idPenerima',as: 'penerima'})
    PermintaanPromosiJabatan.belongsTo(models.Karyawan, {foreignKey: 'idPelapor',as: 'pelapor'})
    PermintaanPromosiJabatan.belongsTo(models.Karyawan, {foreignKey: 'idKaryawan',as: 'karyawan'})
  }
  return PermintaanPromosiJabatan;
};