'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PembagianAnggota extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  PembagianAnggota.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    idKaryawan:  {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    JabatanId:  {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    groupKaryawan:  {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    ketua:  {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      unique: true,
    },
  }, {
    sequelize,
    modelName: 'PembagianAnggota',
    tableName: 'pembagiananggota',
  });
  PembagianAnggota.associate = function(models){
    PembagianAnggota.belongsTo(models.Karyawan, {foreignKey: 'idKaryawan',as: 'karyawan'})
    PembagianAnggota.belongsTo(models.Jabatan, {foreignKey: 'JabatanId',as: 'jabatan'})
  }
  return PembagianAnggota;
};