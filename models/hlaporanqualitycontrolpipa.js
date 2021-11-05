'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HLaporanQualityControlPipa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  HLaporanQualityControlPipa.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
      autoIncrement: false,
    },
    shift:  {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    tipeMesin:  {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    idPelapor:  {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    idKetua:  {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    merk:  {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    panjang:  {
      type: DataTypes.FLOAT,
      allowNull: false,
      unique: true,
    },
    ketebalan:  {
      type: DataTypes.FLOAT,
      allowNull: false,
      unique: true,
    },
    diameterLuar:  {
      type: DataTypes.FLOAT,
      allowNull: false,
      unique: true,
    },
    diameterDalam:  {
      type: DataTypes.FLOAT,
      allowNull: false,
      unique: true,
    },
    totalReject:  {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    totalProduksi:  {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
  }, {
    sequelize,
    modelName: 'HLaporanQualityControlPipa',
    tableName: 'hlaporanqualitycontrolpipa',
  });
  HLaporanQualityControlPipa.associate = function(models){
    HLaporanQualityControlPipa.hasMany(models.DLaporanQualityControlPipa,{as: 'dLaporanQC'})
    HLaporanQualityControlPipa.belongsTo(models.Karyawan, {foreignKey: 'idPelapor',as: 'karyawan'})
    HLaporanQualityControlPipa.belongsTo(models.Karyawan, {foreignKey: 'idKetua',as: 'ketua'})
  }
  return HLaporanQualityControlPipa;
};