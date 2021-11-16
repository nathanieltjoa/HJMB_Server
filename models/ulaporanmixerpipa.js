'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ULaporanMixerPipa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ULaporanMixerPipa.init({
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    DLaporanMixerPipaId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    namaBahan: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    totalBahan: {
      type: DataTypes.FLOAT,
      allowNull: false,
      unique: true,
    },
    diHapus: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      unique: true,
    },
  }, {
    sequelize,
    modelName: 'ULaporanMixerPipa',
    tableName: 'ulaporanmixerpipa',
  });
  ULaporanMixerPipa.associate = function(models){
    ULaporanMixerPipa.belongsTo(models.DLaporanMixerPipa,{foreignKey: 'DLaporanMixerPipaId', as: 'uLaporanMixerPipa'})
  }
  return ULaporanMixerPipa;
};