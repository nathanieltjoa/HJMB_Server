'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DLaporanMixerPipa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  DLaporanMixerPipa.init({
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    HLaporanMixerPipaId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    totalHasil: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    targetKerja: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    keterangan: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    pernahBanding: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    keteranganBanding: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
  }, {
    sequelize,
    modelName: 'DLaporanMixerPipa',
    tableName: 'dlaporanmixerpipa',
  });
  DLaporanMixerPipa.associate = function(models){
    DLaporanMixerPipa.hasMany(models.ULaporanMixerPipa,{foreignKey: 'DLaporanMixerPipaId',as: 'uLaporan'})
    DLaporanMixerPipa.hasMany(models.FLaporanMixerPipa,{foreignKey: 'DLaporanMixerPipaId',as: 'fLaporan'})
    DLaporanMixerPipa.belongsTo(models.HLaporanMixerPipa, {foreignKey: 'HLaporanMixerPipaId',as: 'hLaporan'})
  }
  return DLaporanMixerPipa;
};