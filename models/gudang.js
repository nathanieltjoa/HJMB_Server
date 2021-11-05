'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Gudang extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Gudang.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    namaGudang: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    alamatGudang: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
  }, {
    sequelize,
    modelName: 'Gudang',
    tableName: 'gudang',
  });
  Gudang.associate = function(models){
    Gudang.hasMany(models.HLaporanSekuriti,{as: 'laporanGudang'})
  }
  return Gudang;
};