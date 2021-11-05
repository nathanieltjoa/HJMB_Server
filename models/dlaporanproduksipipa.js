'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DLaporanProduksiPipa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //DLaporanProduksiPipa.hasMany(models.ULaporanProduksiPipa,{as: 'uLaporan'})
      //DLaporanProduksiPipa.belongsTo(models.HLaporanProduksiPipa, {foreignKey: 'idHLaporan', foreignKeyConstraint:'idHLaporan_Constraint',as: 'idHLaporan_Constraint'})
    }
  };
  DLaporanProduksiPipa.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    HLaporanProduksiPipaId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    totalProduksi: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
    },
    targetProduksi: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
    },
    foto: {
      type: DataTypes.STRING,
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
      allowNull: true,
      unique: true,
    },
    jamLaporan: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    keterangan: {
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
    modelName: 'DLaporanProduksiPipa',
    tableName: 'dlaporanproduksipipa',
  });
  DLaporanProduksiPipa.associate = function(models){
    DLaporanProduksiPipa.hasMany(models.ULaporanProduksiPipa,{as: 'uLaporan'})
    DLaporanProduksiPipa.belongsTo(models.HLaporanProduksiPipa, {foreignKey: 'HLaporanProduksiPipaId',as: 'hLaporan'})
  }
  return DLaporanProduksiPipa;
};