'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HLaporanBarangRetur extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  HLaporanBarangRetur.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
      autoIncrement: false,
    },
    idPelapor:  {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    idNota:  {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    foto:  {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    keterangan:  {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  }, {
    sequelize,
    modelName: 'HLaporanBarangRetur',
    tableName: 'hlaporanbarangretur'
  });
  HLaporanBarangRetur.associate = function(models){
    HLaporanBarangRetur.hasMany(models.DLaporanBarangRetur,{as: 'dLaporanBarangRetur'})
    HLaporanBarangRetur.belongsTo(models.Karyawan, {foreignKey: 'idPelapor',as: 'karyawan'})
  }
  return HLaporanBarangRetur;
};