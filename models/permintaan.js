'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Permintaan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Permintaan.init({
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    idPeminta: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
    },
    IzinId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    tanggalMulai: {
      type: Sequelize.DATE,
      allowNull: false,
      unique: true,
    },
    tanggalBerakhir: {
      type: Sequelize.DATE,
      allowNull: true,
      unique: true,
    },
    totalHari: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
    },
    keterangan: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    upload: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
    },
    idKetua: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
    },
    idHRD: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
    },
    alasan: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
  }, {
    sequelize,
    modelName: 'Permintaan',
    tableName: 'permintaan'
  });
  Permintaan.associate = function(models){
    Permintaan.belongsTo(models.Izin, {foreignKey: 'IzinId',as: 'izin'})
    Permintaan.belongsTo(models.Karyawan, {foreignKey: 'idPeminta',as: 'peminta'})
    Permintaan.belongsTo(models.Karyawan, {foreignKey: 'idKetua',as: 'ketua'})
    Permintaan.belongsTo(models.Karyawan, {foreignKey: 'idHRD',as: 'hrd'})
  }
  return Permintaan;
};