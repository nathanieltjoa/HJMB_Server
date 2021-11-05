'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PengaruhNilai extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  PengaruhNilai.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    nilaiMin:  {
      type: DataTypes.FLOAT,
      allowNull: false,
      unique: true,
    },
    nilaiMax:  {
      type: DataTypes.FLOAT,
      allowNull: false,
      unique: true,
    },
    hasilNilai:  {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    pengurangan:  {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      unique: true,
    },
    nilaiUang:  {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
  }, {
    sequelize,
    modelName: 'PengaruhNilai',
    tableName: 'pengaruhnilai',
  });
  return PengaruhNilai;
};