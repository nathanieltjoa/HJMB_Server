'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Absensi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Absensi.init({
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    idKaryawan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    tanggal: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      unique: true,
    },
    JamKerjaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    scanMasuk: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    scanPulang: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    terlambat: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    jamBolos: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    absen: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      unique: true,
    },
    lembur: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  }, {
    sequelize,
    modelName: 'Absensi',
    tableName: 'Absensi'
  });
  Absensi.associate = function(models){
    Absensi.belongsTo(models.JamKerja, {foreignKey: 'JamKerjaId',as: 'jamKerja'})
  }
  return Absensi;
};