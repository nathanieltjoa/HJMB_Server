'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DLaporanQualityControlPipa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  DLaporanQualityControlPipa.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
      autoIncrement: false,
    },
    HLaporanQualityControlPipaId:  {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    jamLaporan:  {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    diameter:  {
      type: DataTypes.FLOAT,
      allowNull: false,
      unique: true,
    },
    panjang:  {
      type: DataTypes.FLOAT,
      allowNull: false,
      unique: true,
    },
    berat:  {
      type: DataTypes.FLOAT,
      allowNull: false,
      unique: true,
    },
    keterangan:  {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    status:  {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    pernahBanding :  {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      unique: true,
    },
    keteranganBanding:  {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    foto: {
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
    modelName: 'DLaporanQualityControlPipa',
    tableName: 'dlaporanqualitycontrolpipa',
  });
  DLaporanQualityControlPipa.associate = function(models){
    DLaporanQualityControlPipa.belongsTo(models.HLaporanQualityControlPipa, {foreignKey: 'HLaporanQualityControlPipaId',as: 'hLaporan'})
    DLaporanQualityControlPipa.hasMany(models.ULaporanQualityControl,{foreignKey: 'DLaporanQualityControlPipaId',as: 'uLaporan'})
  }
  return DLaporanQualityControlPipa;
};