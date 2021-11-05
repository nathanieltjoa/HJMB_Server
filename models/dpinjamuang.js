'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DPinjamUang extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  DPinjamUang.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.STRING
    },
    HPinjamUangId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    totalPembayaran: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    pembayaranKe: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    lunas: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      unique: true,
    },
  }, {
    sequelize,
    modelName: 'DPinjamUang',
    tableName: 'dpinjamuang',
  });
  DPinjamUang.associate = function(models){
    DPinjamUang.belongsTo(models.HPinjamUang, {foreignKey: 'HPinjamUangId',as: 'dPinjamUang'})
  }
  return DPinjamUang;
};