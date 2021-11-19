'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DLaporanBarangRetur extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  DLaporanBarangRetur.init({
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    HLaporanBarangReturId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    LaporanStokId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    jumlah: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
  }, {
    sequelize,
    modelName: 'DLaporanBarangRetur',
    tableName: 'dlaporanbarangretur'
  });
  DLaporanBarangRetur.associate = function(models){
    DLaporanBarangRetur.belongsTo(models.HLaporanBarangRetur, {foreignKey: 'HLaporanBarangReturId',as: 'hLaporan'})
    DLaporanBarangRetur.belongsTo(models.LaporanStok, {foreignKey: 'LaporanStokId',as: 'barang'})
  }
  return DLaporanBarangRetur;
};