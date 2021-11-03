'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class IndexPenilaian extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  IndexPenilaian.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    namaIndex: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    nilaiIndex: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    keteranganIndex: {
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
    modelName: 'IndexPenilaian',
    tableName: 'IndexPenilaian',
  });
  IndexPenilaian.associate = function(models){
    IndexPenilaian.hasMany(models.PenilaianHRD,{as: 'indexPenilaianHRD'})
  }
  return IndexPenilaian;
};