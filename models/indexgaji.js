'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class IndexGaji extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  IndexGaji.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    namaGaji: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    keteranganGaji: {
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
    modelName: 'IndexGaji',
    tableName: 'indexgaji'
  });
  IndexGaji.associate = function(models){
    IndexGaji.hasMany(models.DKontrakGaji,{as: 'dKontrakIndexGaji', foreignKey: 'IndexGajiId'})
  }
  return IndexGaji;
};