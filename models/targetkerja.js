'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TargetKerja extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  TargetKerja.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    namaDivisi: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    namaPengerjaan: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    jumlahTarget: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
    },
    satuanTarget: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    updatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
    },
  }, {
    sequelize,
    modelName: 'TargetKerja',
    tableName: 'targetKerja'
  });
  return TargetKerja;
};