'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ListDistribusiKuisioner extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ListDistribusiKuisioner.init({
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
    TingkatJabatan:  {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    persentaseNilai:  {
      type: DataTypes.INTEGER,
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
    modelName: 'ListDistribusiKuisioner',
    tableName: 'ListDistribusiKuisioner',
  });
  ListDistribusiKuisioner.associate = function(models){
    ListDistribusiKuisioner.belongsTo(models.ListKuisioner, {foreignKey: 'ListKuisionerId',as: 'listDistribusi'})
  }
  return ListDistribusiKuisioner;
};