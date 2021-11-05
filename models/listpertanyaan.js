'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ListPertanyaan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ListPertanyaan.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    ListKuisionerId:  {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    teskPertanyaan:  {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    jenisPertanyaan:  {
      type: DataTypes.STRING,
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
    modelName: 'ListPertanyaan',
    tableName: 'listpertanyaan',
  });
  ListPertanyaan.associate = function(models){
    ListPertanyaan.belongsTo(models.ListKuisioner, {foreignKey: 'ListKuisionerId',as: 'listPertanyaan'})
    ListPertanyaan.hasMany(models.ListJawaban,{as: 'listJawaban'})
    ListPertanyaan.hasMany(models.ListTanggapan,{as: 'listTanggapan'})
  }
  return ListPertanyaan;
};