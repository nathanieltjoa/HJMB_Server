'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DLaporanDinasSekuriti extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  DLaporanDinasSekuriti.init({
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    HLaporanSekuritiId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    idPelapor: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    jamMasuk: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    jamKeluar: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    noHT: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    keterangan: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  }, {
    sequelize,
    modelName: 'DLaporanDinasSekuriti',
    tableName: 'dlaporandinassekuriti'
  });
  DLaporanDinasSekuriti.associate = function(models){
    DLaporanDinasSekuriti.belongsTo(models.HLaporanSekuriti, {foreignKey: 'HLaporanSekuritiId',as: 'dLaporanDinasSekuriti'})
  }
  return DLaporanDinasSekuriti;
};