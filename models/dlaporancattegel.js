'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DLaporanCatTegel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  DLaporanCatTegel.init({
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    HLaporanCatTegelId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    merkProduk: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    warna: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    jumlahProduk: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    satuanProduk: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    foto: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    keterangan: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    khusus: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      unique: true,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
  }, {
    sequelize,
    modelName: 'DLaporanCatTegel',
    tableName: 'dlaporancattegel',
  });
  DLaporanCatTegel.associate = function(models){
    DLaporanCatTegel.hasMany(models.ULaporanCatTegel,{as: 'uLaporanCatTegel'})
    DLaporanCatTegel.belongsTo(models.HLaporanCatTegel, {foreignKey: 'HLaporanCatTegelId',as: 'hLaporanCatTegel'})
  }
  return DLaporanCatTegel;
};