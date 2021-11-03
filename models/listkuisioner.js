'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ListKuisioner extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ListKuisioner.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    divisi:  {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    namaKuisioner:  {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    deskripsiKuisioner:  {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    jenisKuisioner:  {
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
    modelName: 'ListKuisioner',
    tableName: 'listKuisioner',
  });
  ListKuisioner.associate = function(models){
    ListKuisioner.hasMany(models.ListPertanyaan,{as: 'listPertanyaan'})
    ListKuisioner.hasMany(models.ListDistribusiKuisioner,{as: 'listDistribusi'})
  }
  return ListKuisioner;
};