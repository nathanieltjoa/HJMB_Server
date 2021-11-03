'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class IndexIuran extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  IndexIuran.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    namaIuran: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    keteranganIuran: {
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
    modelName: 'IndexIuran',
    tableName: 'IndexIuran',
  });
  IndexIuran.associate = function(models){
    IndexIuran.hasMany(models.DKontrakIuran,{as: 'dKontakIndexIuran', foreignKey: 'IndexIuranId'})
  }
  return IndexIuran;
};