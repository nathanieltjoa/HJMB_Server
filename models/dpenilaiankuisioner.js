'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DPenilaianKuisioner extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  DPenilaianKuisioner.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.STRING
    },
    HPenilaianKuisionerId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    ListKuisionerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    idPenilai: {
      type: DataTypes.INTEGER,
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
    modelName: 'DPenilaianKuisioner',
    tableName: 'dpenilaiankuisioner'
  });
  DPenilaianKuisioner.associate = function(models){
    DPenilaianKuisioner.belongsTo(models.HPenilaianKuisioner, {foreignKey: 'HPenilaianKuisionerId',as: 'dPenilaianKuisioner'})
    DPenilaianKuisioner.belongsTo(models.ListKuisioner, {foreignKey: 'ListKuisionerId',as: 'dListKuisioner'})
  }
  return DPenilaianKuisioner;
};