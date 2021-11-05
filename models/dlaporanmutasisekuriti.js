'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DLaporanMutasiSekuriti extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  DLaporanMutasiSekuriti.init({
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
    jamLaporan: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    uraian: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    foto: {
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
    modelName: 'DLaporanMutasiSekuriti',
    tableName: 'dlaporanmutasisekuriti'
  });
  DLaporanMutasiSekuriti.associate = function(models){
    DLaporanMutasiSekuriti.belongsTo(models.HLaporanSekuriti, {foreignKey: 'HLaporanSekuritiId',as: 'dLaporanMutasiSekuriti'})
  }
  return DLaporanMutasiSekuriti;
};