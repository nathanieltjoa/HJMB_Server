'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DKontrakGaji extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  DKontrakGaji.init({
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    HKontrakKaryawanId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    IndexGajiId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
  }, {
    sequelize,
    modelName: 'DKontrakGaji',
    tableName: 'DKontrakGaji'
  });
  DKontrakGaji.associate = function(models){
    DKontrakGaji.belongsTo(models.HKontrakKaryawan, {foreignKey: 'HKontrakKaryawanId',as: 'dKontrakGaji'})
    DKontrakGaji.belongsTo(models.IndexGaji, {foreignKey: 'IndexGajiId',as: 'dKontrakIndexGaji'})
  }
  return DKontrakGaji;
};