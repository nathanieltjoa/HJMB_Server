'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TipeMesin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  TipeMesin.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    DivisiId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    namaTipe: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      unique: true,
    },
  }, {
    sequelize,
    modelName: 'TipeMesin',
    tableName: 'TipeMesin',
  });
  return TipeMesin;
};