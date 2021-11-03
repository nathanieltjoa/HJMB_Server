'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DKontrakIuran extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  DKontrakIuran.init({
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
    IndexIuranId: {
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
    modelName: 'DKontrakIuran',
    tableName: 'DKontrakIuran',
  });
  DKontrakIuran.associate = function(models){
    DKontrakIuran.belongsTo(models.HKontrakKaryawan, {foreignKey: 'HKontrakKaryawanId',as: 'dKontrakIuran'})
    DKontrakIuran.belongsTo(models.IndexIuran, {foreignKey: 'IndexIuranId',as: 'dKontrakIndexIuran'})
  }
  return DKontrakIuran;
};