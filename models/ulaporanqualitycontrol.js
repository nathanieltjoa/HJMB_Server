'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ULaporanQualityControl extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ULaporanQualityControl.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
      autoIncrement: false,
    },
    DLaporanQualityControlPipaId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    namaBagian: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    nilai: {
      type: DataTypes.FLOAT,
      allowNull: false,
      unique: true,
    },
  }, {
    sequelize,
    modelName: 'ULaporanQualityControl',
    tableName: 'ulaporanqualitycontrol'
  });
  ULaporanQualityControl.associate = function(models){
    ULaporanQualityControl.belongsTo(models.DLaporanQualityControlPipa,{foreignKey: 'DLaporanQualityControlPipaId', as: 'uLaporanQualityControl'})
  }
  return ULaporanQualityControl;
};