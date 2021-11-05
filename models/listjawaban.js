'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ListJawaban extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ListJawaban.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    ListPertanyaanId:  {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    teskJawaban:  {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    benar:  {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      unique: true,
    },
    status:  {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      unique: true,
    },
  }, {
    sequelize,
    modelName: 'ListJawaban',
    tableName: 'listjawaban',
  });
  ListJawaban.associate = function(models){
    ListJawaban.belongsTo(models.ListPertanyaan, {foreignKey: 'ListPertanyaanId',as: 'listJawaban'})
  }
  return ListJawaban;
};