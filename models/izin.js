'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Izin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Izin.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    namaIzin: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    totalIzin: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    keterangan: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      unique: true,
    },
    batasanHari:{
      type: DataTypes.BOOLEAN,
      allowNull: false,
      unique: true,
    }
  }, {
    sequelize,
    modelName: 'Izin',
    tableName: 'izin',
  });
  Izin.associate = function(models){
    Izin.hasMany(models.Permintaan,{foreignKey: 'IzinId',as: 'listPermintaan'})
  }
  return Izin;
};