'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LaporanMixerPipa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  LaporanMixerPipa.init({
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    tipeMesin: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    bahanDigunakan: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
    },
    totalHasil: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
    },
    targetMixer: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
    idPelapor: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
    },
    idKetua: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
    },
    pernahBanding: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
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
    modelName: 'LaporanMixerPipa',
    tableName: 'laporanMixerPipa',
  });
  LaporanMixerPipa.associate = function(models){
    LaporanMixerPipa.belongsTo(models.Karyawan, {foreignKey: 'idPelapor',as: 'karyawan'})
    LaporanMixerPipa.belongsTo(models.Karyawan, {foreignKey: 'idKetua',as: 'ketua'})
  }
  return LaporanMixerPipa;
};