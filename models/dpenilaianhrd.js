'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DPenilaianHRD extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  DPenilaianHRD.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.STRING
    },
    HPenilaianHRDId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    IndexPenilaianId: {
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
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
  }, {
    sequelize,
    modelName: 'DPenilaianHRD',
    tableName: 'dpenilaianhrd',
  });
  DPenilaianHRD.associate = function(models){
    DPenilaianHRD.belongsTo(models.HPenilaianHRD, {foreignKey: 'HPenilaianHRDId',as: 'dPenilaianHRD'})
    DPenilaianHRD.belongsTo(models.IndexPenilaian, {foreignKey: 'IndexPenilaianId',as: 'dIndexPenilaian'})
  }
  return DPenilaianHRD;
};