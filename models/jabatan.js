'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Jabatan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Jabatan.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    namaJabatan: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    jabatanKu: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    tingkatJabatan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    }
  }, {
    sequelize,
    modelName: 'Jabatan',
    tableName: 'jabatan'
  });
  Jabatan.associate = function(models){
    Jabatan.hasMany(models.Karyawan,{as: 'jabatan', foreignKey: 'JabatanId'})
    Jabatan.hasMany(models.PembagianAnggota,{as: 'PembagianAnggotaJabatan', foreignKey: 'JabatanId'})
  }
  return Jabatan;
};