'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PenilaianHRD extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  PenilaianHRD.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
      autoIncrement: false,
    },
    idPelapor:  {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    idKaryawan:  {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    IndexPenilaianId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    nilaiKaryawan:  {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
  }, {
    sequelize,
    modelName: 'PenilaianHRD',
    tableName: 'penilaianhrd'
  });
  PenilaianHRD.associate = function(models){
    PenilaianHRD.belongsTo(models.IndexPenilaian, {foreignKey: 'IndexPenilaianId',as: 'indexPenilaianHRD'})
  }
  return PenilaianHRD;
};