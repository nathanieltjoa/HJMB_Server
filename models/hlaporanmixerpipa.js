'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HLaporanMixerPipa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  HLaporanMixerPipa.init({
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    jenisMixer: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    tipeMesin: {
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
    totalMix: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
  }, {
    sequelize,
    modelName: 'HLaporanMixerPipa',
    tableName: 'hlaporanmixerpipa',
  });
  HLaporanMixerPipa.associate = function(models){
    HLaporanMixerPipa.belongsTo(models.Karyawan, {foreignKey: 'idPelapor',as: 'karyawan'})
    HLaporanMixerPipa.belongsTo(models.Karyawan, {foreignKey: 'idKetua',as: 'ketua'})
    HLaporanMixerPipa.hasMany(models.DLaporanMixerPipa,{foreignKey: 'HLaporanMixerPipaId',as: 'dLaporanMixerPipa'})
  }
  return HLaporanMixerPipa;
};