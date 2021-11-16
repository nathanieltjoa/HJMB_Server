'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FLaporanMixerPipa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  FLaporanMixerPipa.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.STRING
    },
    DLaporanMixerPipaId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    foto: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  }, {
    sequelize,
    modelName: 'FLaporanMixerPipa',
    tableName: 'flaporanmixerpipa',
  });
  FLaporanMixerPipa.associate = function(models){
    FLaporanMixerPipa.belongsTo(models.DLaporanMixerPipa,{foreignKey: 'DLaporanMixerPipaId', as: 'fLaporanMixerPipa'})
  }
  return FLaporanMixerPipa;
};