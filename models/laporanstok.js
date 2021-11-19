'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LaporanStok extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  LaporanStok.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    jenisBarang:  {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    merkBarang:  {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    tipeBarang:  {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    ukuranBarang:  {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    satuanBarang:  {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    jumlahBarang:  {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    status:  {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      unique: true,
    },
  }, {
    sequelize,
    modelName: 'LaporanStok',
    tableName: 'laporanstok',
  });
  LaporanStok.associate = function(models){
    LaporanStok.hasMany(models.LaporanKeluarMasukPipa,{as: 'laporanStokKeluarMasukPipa'})
    LaporanStok.hasMany(models.DLaporanStokistPipa,{as: 'laporanStokStokistPipa'})
    LaporanStok.hasMany(models.DLaporanBarangRetur,{as: 'dLaporanStokBarangRetur'})
    LaporanStok.hasMany(models.DLaporanStokRusak,{as: 'dLaporanStokBarangRusak'})
  }
  return LaporanStok;
};