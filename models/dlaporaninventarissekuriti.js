'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DLaporanInventarisSekuriti extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  DLaporanInventarisSekuriti.init({
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
    namaBarang: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    jumlahBarang: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    baik: {
      type: DataTypes.BOOLEAN,
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
    modelName: 'DLaporanInventarisSekuriti',
    tableName: 'DLaporanInventarisSekuriti'
  });
  DLaporanInventarisSekuriti.associate = function(models){
    DLaporanInventarisSekuriti.belongsTo(models.HLaporanSekuriti, {foreignKey: 'HLaporanSekuritiId',as: 'dLaporanInventarisSekuriti'})
  }
  return DLaporanInventarisSekuriti;
};