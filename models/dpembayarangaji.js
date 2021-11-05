'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DPembayaranGaji extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  DPembayaranGaji.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.STRING
    },
    HPembayaranGajiId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    pengurangan: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      unique: true,
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    keterangan: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  }, {
    sequelize,
    modelName: 'DPembayaranGaji',
    tableName: 'dpembayarangaji'
  });
  DPembayaranGaji.associate = function(models){
    DPembayaranGaji.belongsTo(models.HPembayaranGaji, {foreignKey: 'HPembayaranGajiId',as: 'dPembayaranGaji'})
    
  }
  return DPembayaranGaji;
};