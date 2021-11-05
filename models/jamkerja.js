'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class JamKerja extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  JamKerja.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    namaShift: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    jamMasuk: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    jamKeluar: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    batasMasuk: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    batasKeluar: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  }, {
    sequelize,
    modelName: 'JamKerja',
    tableName: 'jamkerja',
  });
  JamKerja.associate = function(models){
    JamKerja.hasMany(models.Absensi,{as: 'jamKerja'})
  }
  return JamKerja;
};